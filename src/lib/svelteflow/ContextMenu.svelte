<script lang="ts">
    import { useEdges, useNodes } from '@xyflow/svelte';
  
    export let onClick: () => void;
    export let id: string;
    export let top: number | undefined;
    export let left: number | undefined;
    export let right: number | undefined;
    export let bottom: number | undefined;
  
    const nodes = useNodes();
    const edges = useEdges();
  
    function deleteNode() {
      $nodes = $nodes.filter((node) => node.data.name !== id);
      $edges = $edges.filter((edge) => edge.source !== id && edge.target !== id);
      document.getElementById(id).hidden = false;
    }

  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
    class="context-menu"
    on:click={onClick}
  >
    <p style="margin: 0.5em;">
      <small>{id}</small>
    </p>
    <button on:click={deleteNode}>Eliminar</button>
  </div>
  
  <style>
    .context-menu {
      background: white;
      border-style: solid;
      box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
      position: absolute;
      z-index: 10;
    }
  
    .context-menu button {
      border: none;
      display: block;
      padding: 0.5em;
      text-align: left;
      width: 100%;
    }
  
    .context-menu button:hover {
      background: white;
    }
  </style>
  