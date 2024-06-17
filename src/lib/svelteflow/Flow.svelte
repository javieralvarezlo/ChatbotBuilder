<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		useSvelteFlow,
		useNodes,
		type IsValidConnection,
		useEdges
	} from '@xyflow/svelte';
	import Sidebar from './Sidebar.svelte';

	import '@xyflow/svelte/dist/style.css';
	import IntentNode from './IntentNode.svelte';
	import ActionNode from './ActionNode.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ButtonEdge from './ButtonEdge.svelte';
	import { onMount } from 'svelte';

	const nodeData = useNodes();
	const edgeData = useEdges()

	export let intents: any[];
	export let responses: any[];
	export let nodesProp: any[];
	export let edgesProp: any[];
	export let t: string;

	let nodes = writable(nodesProp);
	let edges = writable(edgesProp);

	let menu: {
		id: string;
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	} | null;
	let width: number;
	let height: number;
	const { getZoom } = useSvelteFlow();

	function handleContextMenu({ detail: { event, node } }) {
		event.preventDefault();
		let zoom = getZoom();
		menu = {
			id: node.data.name,
			top: event.clientY < height - 200 ? flowToScreenPosition(event.clientY).y : undefined,
			left: event.clientX < width - 200 ? flowToScreenPosition(event.clientX).x : undefined,
			right: event.clientX >= width - 200 ? width - flowToScreenPosition(event.clientX).x : undefined,
			bottom: event.clientY >= height - 200 ? height - flowToScreenPosition(event.clientY).y : undefined
		};
	}

	function handlePaneClick() {
		menu = null;
	}

	const { screenToFlowPosition, flowToScreenPosition } = useSvelteFlow();
	const onDragOver = (event: DragEvent) => {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const nodeTypes = {
		intent: IntentNode,
		action: ActionNode
	};

	const edgeTypes = {
		default: ButtonEdge,
		button: ButtonEdge
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		if (!event.dataTransfer) {
			return null;
		}

		const data = JSON.parse(event.dataTransfer.getData('application/svelteflow'));

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		$nodeData = [
			...$nodeData,
			{
				id: `${Math.random()}`,
				type: data.type,
				position,
				data,
				origin: [0.5, 0.0]
			}
		];

		document.getElementById(data.name).hidden = true;
	};

	const isValidConnection: IsValidConnection = (connection) => {
		let source = $nodeData.find((el) => el.id === connection.source);
		let target = $nodeData.find((el) => el.id === connection.target);
		return (
			((source?.type === 'intent' && target?.type === 'action') ||
			(source?.type === 'action' && target?.type === 'intent'))
			&& (source?.type == 'intent' && $edgeData.filter(e => e.source === source.id).length === 0)
		);
	};
</script>

<div bind:clientWidth={width} bind:clientHeight={height} id="flow">
	<SvelteFlow
		{isValidConnection}
		{nodes}
		{edges}
		{nodeTypes}
		{edgeTypes}
		fitView
		on:dragover={onDragOver}
		on:drop={onDrop}
		on:nodecontextmenu={handleContextMenu}
		on:paneclick={handlePaneClick}
	>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		{#if menu}
			<ContextMenu
				onClick={handlePaneClick}
				id={menu.id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
			/>
		{/if}

		<MiniMap />
	</SvelteFlow>
	<Sidebar {intents} {responses} {t} />
</div>

<style>
	#flow {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column-reverse;
	}

	:global(.svelte-flow .svelte-flow__node .svelte-flow__handle) {
		width: 8px;
		height: 8px;
	}

	:global(.svelte-flow .svelte-flow__handle.connectingto) {
		background: #ff6060;
	}

	:global(.svelte-flow .svelte-flow__handle.valid) {
		background: #55dd99;
	}
</style>
