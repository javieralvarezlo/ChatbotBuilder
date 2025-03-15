<script>
  import { useSvelteFlow } from "@xyflow/svelte";

    const data = useSvelteFlow();
    function click() {
    }
</script>

<div>
    <button on:click={click}>Datos</button>
</div>


<style>
    button {
        z-index: -1;
    }
</style>