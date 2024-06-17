import { getDomainFile, getRules, getStories, saveDialog, saveIntents, saveRules, saveSlots, saveStories } from '$lib/server/rasa';
import { emailToPath } from '$lib/services/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "./$types";


export const load: PageServerLoad = async ({ locals, params, parent }) => {
    const { bot, nluFile, domainFile, botInfo } = await parent();
    const dialog = params.dialog;

    let nodes: any[];
    let edges: any[];

    let intents: { name: string; }[] = [];
    let responses: { name: string; }[] = [];

    nluFile.nlu.map((intent: { intent: string; }) => {
        intents.push({ name: intent.intent })
    })

    Object.keys(domainFile.responses).map(response => {
        responses.push({ name: response.split("utter_")[1] })
    })

    nodes = botInfo.dialogs.find((el: { name: string; }) => el.name === dialog).flow.nodes
    edges = botInfo.dialogs.find((el: { name: string; }) => el.name === dialog).flow.edges

    return {
        bot,
        intents,
        responses,
        botInfo,
        dialog,
        nodes,
        edges
    }
}

export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const nodes = JSON.parse(formData.get("nodes"));
        const edges = JSON.parse(formData.get("edges"));
        const type = formData.get("type");

        const root = getRoot(nodes, edges);
        let caminos: any[] = [];

        profundidad(edges, nodes, root, [], caminos, type === "relaxed")
        let stories = getStories(emailToPath(event.locals.user?.email), event.params.bot).stories;
        let rules = getRules(emailToPath(event.locals.user?.email), event.params.bot).rules;




        if (type === "relaxed") {
            stories = stories.filter(s => !s.story.startsWith(event.params.dialog))
            let newStories: any[] = []
            caminos.map((camino, i) => {
                let story = { story: event.params.dialog + i, steps: [] }
                camino.map((step: { type: string; }) => {
                    let newStep = {}
                    newStep[step.type] = step.type === "intent" || step.type === "checkpoint" ? step.name : `utter_${step.name}`
                    story.steps.push(newStep)
                })
                newStories = [...newStories, story]
            })

            newStories = [...stories, ...newStories]
            saveStories(emailToPath(event.locals.user?.email), event.params.bot, newStories)
        } else if (type === "strict") {
            let domain = getDomainFile(emailToPath(event.locals.user?.email), event.params.bot)
            let intents = nodes.filter(n => n.type === "intent")

            Object.keys(domain.slots).map(key => {
                if (key.startsWith(event.params.dialog.replace(" ", "_"))) {
                    delete domain.slots[key]
                }
            })

            intents.map(intent => {
                let intentName: string = `${event.params.dialog.replace(" ", "_")}_${intent.data.name}_flag`
                let slot = {}

                domain.slots[intentName] = {
                    type: "bool",
                    influence_conversation: true,
                    mappings: [
                        {
                            type: "from_intent",
                            value: true,
                            intent: intent.data.name
                        }
                    ]
                }
            })


            rules = rules.filter(r => !r.rule.startsWith(event.params.dialog))

            caminos.map((camino, nCamino) => {
                camino.map((paso, nPaso) => {
                    if (nPaso % 2 === 0 && nPaso !== 0) {
                        let newRule = {
                            rule: event.params.dialog + "_" + camino[nPaso].name,
                            condition: [
                                {
                                    slot_was_set: [
                                        {
                                            [`${event.params.dialog.replace(" ", "_")}_${camino[nPaso - 2].name}_flag`]: true
                                        }
                                    ]
                                }
                            ],
                            steps: [
                                {
                                    intent: camino[nPaso].name
                                },
                                {
                                    action: "utter_" + camino[nPaso + 1].name
                                }
                            ]
                        };

                        let newBadRule = {
                            rule: event.params.dialog + "_" + camino[nPaso].name +"_mal",
                            condition: [
                                {
                                    slot_was_set: [
                                        {
                                            [`${event.params.dialog.replace(" ", "_")}_${camino[nPaso - 2].name}_flag`]: false
                                        }
                                    ]
                                }
                            ],
                            steps: [
                                {
                                    intent: camino[nPaso].name
                                },
                                {
                                    action: "action_default_fallback"
                                }
                            ]
                        };

                        rules.push(newRule)
                        rules.push(newBadRule)

                    }

                })
            })

            saveSlots(emailToPath(event.locals.user?.email), event.params.bot, domain.slots)
            saveRules(emailToPath(event.locals.user?.email), event.params.bot, rules)
        }

        saveDialog(emailToPath(event.locals.user?.email), event.params.bot, event.params.dialog, nodes, edges, type)
        return redirect(301, `/bots/${event.params.bot}/dialogs`)
    }

} satisfies Actions;

const getRoot = (nodes: any[], edges: any[]) => {
    return nodes.filter((node) => {
        return node.type == 'intent' && !edges.find((edge) => edge.target === node.id);
    })[0];
}

const profundidad = (edges: any, nodes: any, node: any, actual: any[], result: any[], isRelaxed: boolean) => {

    const nodesWith2Kids = edges.filter((edge: { source: any; }) => edge.source === node.id)

    actual.push({ type: node.type, name: node.data.name });

    if(nodesWith2Kids.length > 1 && isRelaxed) {
        actual.push({type: "checkpoint", name: node.data.name+"_checkpoint"})
        result.push([...actual]);
        actual = [{type: "checkpoint", name: node.data.name+"_checkpoint"}]
    }

    if (!edges.find((edge: { source: any; }) => edge.source === node.id)) {
        result.push([...actual]);
    }

    const caminos = edges.filter((edge: { source: any; }) => edge.source === node.id);
    caminos.map((path: { target: any; }) => {
        profundidad(edges, nodes,
            nodes.find((node: { id: any; }) => node.id === path.target),
            actual,
            result
        );
    });

    actual.pop();
};
