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
		Badge,
		Radio,
		Helper
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
	import Flow from '$lib/svelteflow/Flow.svelte';
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import { redirect } from '@sveltejs/kit';

	export let data: PageData;
	export let form;

	$: dialogs = data.botInfo.dialogs;

	let dialogModal: boolean;
	let currentDialog: string;

	let dialogType: string = 'relaxed';

	const throwError = (message: string) => {
		toast.error(message);
	};

	const throwSuccess = (message: string) => {
		toast.success(message);
	};
</script>

{#if form?.error}
	{throwError(form.error)}
{/if}

<Toaster />

<Modal bind:open={dialogModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar el diálogo <span class="font-bold">{currentDialog}</span
			>? La acción es irreversible
		</h3>
		<form method="POST" action="?/delete" id="deleteDialog" use:enhance>
			<Input type="text" name="dialog" id="dialog" class="hidden" value={currentDialog} />

			<Input type="text" name="type" id="dialog" class="hidden" value={dialogType} />
			<Button
				color="red"
				class="me-2"
				type="submit"
				on:click={() => {
					dialogModal = false;
					document.getElementById('deleteDialog').requestSubmit();
				}}>Sí, eliminar</Button
			>

			<Button color="alternative" on:click={() => (dialogModal = false)}>No, cancelar</Button>
		</form>
	</div>
</Modal>

<div class="flex justify-evenly">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
					<BreadcrumbItem>Diálogos</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Diálogos del bot {data.bot}
			</h5>
			<p>
				Los diálogos son los flujos de interacción del bot con el usuario final. A la hora de crear
				un diálogo puedes diferenciar dos tipos: Relajado y Estricto. El primer tipo ofrece un
				enfoque más conversacional y flexible mientras que el segundo requiere que el bot ejecute
				todos los pasos de dicho camino.
			</p>
		</div>
		<ul
			class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
		>
			{#each dialogs as dialog}
				<li
					class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
				>
					<div class="flex items-center space-x-4 rtl:space-x-reverse">
						<div class="flex-1 min-w-0">
							<a
								href={`/bots/${data.bot}/dialogs/${dialog.name}`}
								class="text-lg text-gray-700 group"
							>
								{dialog.name}
								{#if dialog.type === 'strict'}
									<Badge border large color="red">Estricto</Badge>
								{/if}
								{#if dialog.type === 'relaxed'}
									<Badge border large color="green">Relajado</Badge>
								{/if}
							</a>
						</div>
						<div
							class="group inline-flex items-start justify-start text-base font-semibold text-gray-900 dark:text-white h-auto"
						>
							<Button
								outline={true}
								class="!p-2"
								size="lg"
								on:click={() => {
									dialogModal = true;
									currentDialog = dialog.name;
								}}
							>
								<TrashBinSolid class="w-5 h-5 text-primary-700 group-hover:text-white" />
							</Button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Crea un diálogo</h3>
			<form method="POST" action="?/save" use:enhance>
				<Label class="space-y-2" for="name">
					<span>Nombre del diálogo</span>
					<Input type="text" name="name" id="name" value={form?.name} />
				</Label>
				<Label class="space-y-2 mt-4" for="description">
					<span>Tipo de diálogo</span>
					<Radio
						aria-describedby="helper-checkbox-text"
						name="type"
						bind:group={dialogType}
						value="relaxed">Relajado</Radio
					>
					<Helper id="helper-checkbox-text" class="ps-6"
						>No es necesario pasar por todos los puntos, más natural</Helper
					>
					<Radio
						aria-describedby="helper-checkbox-text"
						name="type"
						bind:group={dialogType}
						value="strict">Estricto</Radio
					>
					<Helper id="helper-checkbox-text" class="ps-6"
						>Es necesario pasar por todos los puntos, menos natural</Helper
					>
				</Label>
				<Button class="w-full mt-4" type="submit">Crear diálogo</Button>
			</form>
		</div>
	</Card>
</div>
