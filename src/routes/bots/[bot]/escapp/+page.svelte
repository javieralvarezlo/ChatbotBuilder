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
		Select
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import {
		ArchiveArrowDownSolid,
		TrashBinSolid,
		ExclamationCircleOutline,
		TrashBinOutline,
		EditOutline,
		CheckOutline,
		CheckCircleSolid,
		PlusOutline
	} from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import { Toaster, toast } from 'svelte-french-toast';

	export let data: PageData;

	let escappAction: string = data.botInfo.escapp.actionOptions;
	let actions = data.actions;

	let errorMessage: string;

	let successMessage: string;

	$: responses = data.responses;

	const throwError = (message: string) => {
		errorMessage = message;
		toast.error(message);
	};

	const throwSuccess = (message: string) => {
		successMessage = message;
		toast.success(message);
	};
</script>

<Toaster />

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
					<BreadcrumbItem>Escapp</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Parámetros de integración con Escapp
			</h5>
			<p>En esta sección se definen los parámetros necesarios para la integración con Escapp.</p>
		</div>

		<form class="flex flex-col space-y-6" method="post" use:enhance action="?/save">
			<div class="">
				<Label for="url" class="block mb-2 text-md">URL de Escapp</Label>
				<Input
					name="url"
					id="url"
					placeholder="https://escapp.etsisi.upm.es/api/escapeRooms/147/"
					bind:value={data.botInfo.escapp.url}
				/>
			</div>
			<div class="mb-6">
				<Label for="puzzle" class="block mb-2 text-md">ID del puzzle</Label>
				<Input id="puzzle" name="puzzle" placeholder="1" bind:value={data.botInfo.escapp.puzzle} />
			</div>
			<div class="mb-6">
				<Label for="solution" class="block mb-2 text-md">Solución del puzzle</Label>
				<Input
					id="solution"
					name="solution"
					placeholder="solución"
					bind:value={data.botInfo.escapp.solution}
				/>
			</div>
			<div class="mb-6">
				<Label for="action" class="block mb-2 text-md"
					>Acción que completa el puzzle
					<Select class="mt-2" name="action" items={actions} bind:value={escappAction} />
				</Label>
			</div>

            <input hidden name="responses" value={JSON.stringify(responses)}/>

			<Button color="green" type="submit">
				<ArchiveArrowDownSolid class="w-3.5 h-3.5 me-2" /> Guardar
			</Button>
		</form>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2 bg-transparent border-none shadow-none">

	</Card>
</div>
