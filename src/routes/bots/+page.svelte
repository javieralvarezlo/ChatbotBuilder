<script lang="ts">
	import { Card, Listgroup, Button, Label, Input, Toast, Helper, Modal } from 'flowbite-svelte';
	import type { PageData } from './$types';

	import { TrashBinSolid, CheckCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data: PageData;

	let popupModal = false;
	let currentBot: string;
</script>

<Modal bind:open={popupModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar el bot <span class="font-bold">{currentBot}</span>? La
			acción es irreversible
		</h3>
		<form method="POST" class="inline" use:enhance on:submit={() => (popupModal = false)}>
			<Input type="text" name="bot" id="bot" class="hidden" value={currentBot} />
			<Button color="red" class="me-2" formaction="?/delete" type="submit">Sí, eliminar</Button>
		</form>

		<Button color="alternative" on:click={() => (popupModal = false)}>No, cancelar</Button>
	</div>
</Modal>

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4">
			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Lista de Bots</h5>
		</div>
		{#if data.bots.length > 0}
			<Listgroup items={data.botStrings} let:item class="border-0 dark:!bg-transparent">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${item.split(":@:")[0]}`}
							class="text-sm font-medium text-gray-900 truncate dark:text-white"
						>
							{item.split(":@:")[0]}
						</a>
						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							{item.split(":@:")[1]}
						</p>
					</div>
					<div
						class="group inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						<Button
							outline={true}
							class="!p-2"
							size="lg"
							on:click={() => {
								popupModal = true;
								currentBot = item.split(":@:")[0];
							}}
						>
							<TrashBinSolid class="w-5 h-5 text-primary-700 group-hover:text-white" />
						</Button>
					</div>
				</div>
			</Listgroup>
		{:else}
			<h5 class="text-lg leading-none text-gray-900 dark:text-white">
				No tienes ningún bot actualmente. Crea uno para ver el listado
			</h5>
		{/if}
	</Card>
	<Card padding="xl" size="sm" class="h-min">
		<form class="flex flex-col space-y-6" method="post" use:enhance action="?/create">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Crea un bot</h3>
			<Label class="space-y-2" for="name">
				<span>Nombre</span>
				<Input
					type="text"
					name="name"
					id="name"
					color={$page.form?.exist ? 'red' : 'base'}
					value={$page.form?.name ?? ''}
				/>
			</Label>
			{#if $page.form?.exist}
				<Helper class="mt-2" color="red"
					><span class="font-medium">Nombre no válido.</span> Ya tienes un bot con ese nombre</Helper
				>
			{/if}
			<Label class="space-y-2" for="description">
				<span>Descripción</span>
				<Input type="text" name="description" id="desc" value={$page.form?.description} />
			</Label>
			<Button type="submit" class="w-full">Crear bot</Button>
		</form>
	</Card>
</div>
{#if $page.form?.create}
	<Toast color="green" class="bottom-2 right-52 absolute">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5 text-green-400" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		Bot creado correctamente
	</Toast>
{/if}
{#if $page.form?.create === false}
	<Toast color="green" class="bottom-2 right-52 absolute">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5 text-red-400" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		Ha ocurrido un error creando el bot!
	</Toast>
{/if}

{#if $page.form?.delete}
	<Toast color="green" class="bottom-2 right-52 absolute">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5 text-green-400" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		Bot eliminado correctamente
	</Toast>
{/if}
