<script lang="ts">
	import { useNodes, useEdges, useSvelteFlow } from '@xyflow/svelte';
	import { onMount } from 'svelte';
	import { useNodesData } from '@xyflow/svelte';
	import { enhance } from '$app/forms';
	import { Button, Helper, Radio } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	const nodeData = useNodes();
	const edgeData = useEdges();

	export let intents: any[];
	export let responses: any[];
	export let t: string;

	let dialogType: string = t;

	const onDragStart = (event: DragEvent, data: Object) => {
		if (!event.dataTransfer) {
			return null;
		}

		event.dataTransfer.setData('application/svelteflow', JSON.stringify(data));
		event.dataTransfer.effectAllowed = 'move';
	};

	onMount(() => {
		$nodeData.map((node) => {
			document.getElementById(node.data.name).hidden = true;
		});
	});

	const save = () => {

		if($nodeData.length === 0) {
			toast.error("No puedes dejar el diálogo vacío")
			return;
		}

		const unconnected = $nodeData.filter((node) => {
			return (
				!$edgeData.find((edge) => edge.target === node.id) &&
				!$edgeData.find((edge) => edge.source === node.id)
			);
		});

		if (unconnected.length !== 0) {
			toast.error("Hay nodos sin conectar")
			return;
		}

		let root = $nodeData.filter((node) => {
			return !$edgeData.find((edge) => edge.target === node.id);
		});

		if (root.length != 1) {
			toast.error("Hay más de un nodo raíz")
			return;
		}

		root = root[0];
		if(root.type !== 'intent') {
			toast.error("El nodo raíz tiene que ser una intención")
			return;
		}
		toast.success("Diálogo guardado correctamente")
		document.getElementById('sfDiagrama').requestSubmit();
	};
</script>

<Toaster />
<aside>
	<div class="label"><p class="text-xl dark:text-white">Intenciones</p></div>

	<div class="nodes-container">
		{#each intents as intent}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				id={intent.name}
				class="input-node node intent"
				on:dragstart={(event) => onDragStart(event, { type: 'intent', name: intent.name })}
				draggable={true}
			>
				{intent.name}
			</div>
		{/each}
	</div>
	<div class="label"><p class="text-xl dark:text-white">Acciones</p></div>
	<div class="nodes-container">
		{#each responses as action}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				id={action.name}
				class="input-node node action"
				on:dragstart={(event) => onDragStart(event, { type: 'action', name: action.name })}
				draggable={true}
			>
				{action.name}
			</div>
		{/each}
	</div>
	<div class="btn-down">
		<form method="POST" action="?/save" id="sfDiagrama" use:enhance>
			<input type="text" name="nodes" value={JSON.stringify($nodeData)} hidden />
			<input type="text" name="edges" value={JSON.stringify($edgeData)} hidden />
			<Radio
				aria-describedby="helper-checkbox-text"
				name="type"
				bind:group={dialogType}
				value="relaxed">Relajado</Radio
			>
			<Radio
				aria-describedby="helper-checkbox-text"
				name="type"
				bind:group={dialogType}
				value="strict">Estricto</Radio
			>
			<button
				class="mt-2 text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus-within:ring-green-300 dark:focus-within:ring-green-800 rounded-lg"
				type="submit"
				on:click|preventDefault={() => save()}>Guardar</button
			>
		</form>
	</div>
</aside>

<style>
	.btn-down {
		margin-bottom: 0.5rem;
	}

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
	}

	.nodes-container {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	.node {
		margin: 0.5rem;
		border: 1px solid #111;
		padding: 0.5rem 1rem;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
	}

	.action {
		background: #97dbf0;
	}

	.intent {
		background: #ebc565;
	}
</style>
