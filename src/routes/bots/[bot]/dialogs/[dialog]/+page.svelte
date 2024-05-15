<script lang="ts">
	import {
		Button,
		Card,
		Input,
		Label,
		Breadcrumb,
		BreadcrumbItem,
		Modal,
		Toast,
		Badge
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { Toaster, toast } from 'svelte-french-toast';
	import Flow from '$lib/svelteflow/Flow.svelte';
	import { SvelteFlowProvider } from '@xyflow/svelte';

	export let data: PageData;


	const intents = data.intents;
	const responses = data.responses;
    const nodes = data.nodes;
    const edges = data.edges;

	const t = data.botInfo.dialogs.find(d => d.name === data.dialog).type

</script>

<Toaster />

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="xl" class="h-100">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}/dialogs`}>Diálogos</a></BreadcrumbItem>
                    <BreadcrumbItem>{data.dialog}</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Diálogo {data.dialog}
			</h5>
			<p>
				Las intenciones son las acciones del usuario que el bot detecta y en base a las cuales toma
				decisiones sobre qué Respuesta dar. Para cada intención hay que definir múltiples ejemplos
				en lenguaje natural de cómo puede ser expresado dicho mensaje. Se recomiendan entre 5 y 20
				ejemplos por Intención.
			</p>
		</div>
		<SvelteFlowProvider>
			<Flow {intents} {responses} nodesProp={nodes} edgesProp={edges} {t}/>
		</SvelteFlowProvider>
	</Card>
</div>
