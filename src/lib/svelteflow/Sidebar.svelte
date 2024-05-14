<script lang="ts">
  import { useNodes, useEdges, useSvelteFlow } from "@xyflow/svelte";
  import { intents, actions } from "./domain";
  import { onMount } from "svelte";
  import { useNodesData } from "@xyflow/svelte";

  const nodeData = useNodes();
  const edgeData = useEdges();

  const onDragStart = (event: DragEvent, data: Object) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/svelteflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  const getData = () => {
    const nodes = JSON.stringify($nodeData);
    const edges = JSON.stringify($edgeData);

    const unconnected = $nodeData.filter((node) => {
      return (
        !$edgeData.find((edge) => edge.target === node.id) &&
        !$edgeData.find((edge) => edge.source === node.id)
      );
    });

    if (unconnected.length !== 0) {
      alert("Hay nodos sin conectar");
      console.log(unconnected);
      return;
    }

    let root = $nodeData.filter((node) => {
      return (
        node.type == "intent" &&
        !$edgeData.find((edge) => edge.target === node.id)
      );
    });

    if (root.length != 1) {
      alert("Hay más de una raíz");
      return;
    }

    let caminos: string[] = [];
    profundidad(root[0], [], caminos);
    console.log(caminos);

    return;
    localStorage.setItem("nodes", nodes);
    localStorage.setItem("edges", edges);
  };

  const profundidad = (node: any, actual: any[], result: any[]) => {
    const edges = $edgeData;
    const nodes = $nodeData;

    actual.push({type: node.type, name: node.data.name});

    if (!edges.find((edge) => edge.source === node.id)) {
      result.push([...actual]);
    }

    const caminos = edges.filter((edge) => edge.source === node.id);
    caminos.map((path) => {
      profundidad(
        nodes.find((node) => node.id === path.target),
        actual,
        result,
      );
    });

    actual.pop();
  };

  onMount(() => {
    $nodeData.map((node) => {
      document.getElementById(node.data.name).hidden = true;
    });
  });
</script>

<aside>
  <div class="label">You can drag these nodes to the pane below.</div>
  <button on:click={getData}>Obtener datos</button>
  <div class="nodes-container">
    {#each intents as intent}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id={intent.name}
        class="input-node node"
        on:dragstart={(event) =>
          onDragStart(event, { type: "intent", name: intent.name })}
        draggable={true}
      >
        {intent.name}
      </div>
    {/each}
  </div>
  <div class="nodes-container">
    {#each actions as action}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id={action.name}
        class="input-node node"
        on:dragstart={(event) =>
          onDragStart(event, { type: "action", name: action.name })}
        draggable={true}
      >
        {action.name}
      </div>
    {/each}
  </div>
</aside>

<style>
  aside {
    width: 100%;
    background: #f4f4f4;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .label {
    margin: 1rem 0;
    font-size: 0.9rem;
  }

  .nodes-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .node {
    margin: 0.5rem;
    border: 1px solid #111;
    padding: 0.5rem 1rem;
    font-weight: 700;
    border-radius: 3px;
    cursor: grab;
    width: 50px;
  }
</style>
