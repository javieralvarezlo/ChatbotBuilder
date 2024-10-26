<script lang="ts">
	import {
		Button,
		Card,
		Input,
		Label,
		Breadcrumb,
		BreadcrumbItem,
		Modal,
		Toast
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
	import {Toaster, toast} from 'svelte-french-toast'


	export let data: PageData;

	let intentName: string;
	let intentContent: string;

	let intentModal: boolean;
	let currentIntent: string;

	let exampleModal: boolean;
	let currentExample: string;

	let edittingExample: string;
	let creatingExample: string;

	let editMode: boolean;
	let createMode: boolean;

	let errorMessage: string;

	let successMessage: string;

	$: intents = data.intents;

	const removeIntent = (intent: any) => {
		const index = intents.indexOf(intents.find((el) => el.intent === intent));
		intents.splice(index, 1);
		intents = intents;
		intentModal = false;
		throwSuccess('Intención eliminada correctamente');
	};

	const removeExample = () => {
		let index;
		intents
			.find((el) => el.intent === currentIntent)
			.examples.map((el: any, idx: number) => {
				if (el.text === currentExample) index = idx;
			});

		intents.find((el) => el.intent === currentIntent).examples.splice(index, 1);
		intents = intents;
		exampleModal = false;
		throwSuccess('Mensaje eliminado correctamente');
	};

	const create = () => {
		if (!intentName) {
			throwError('Debes indicar un nombre');
			return;
		}
		if (intents.find((i) => i.intent === intentName)) {
			throwError('Ya existe una respuesta con ese nombre');
			return;
		}
		if (!intentContent) {
			throwError('Debes indicar un mensaje inicial');
			return;
		}
		intents.push({ intent: intentName, examples: [intentContent] });
		intents = intents;
		intentName = '';
		intentContent = '';
		throwSuccess('Intención creada correctamente');
	};

	const throwError = (message: string) => {
		errorMessage = message;
		toast.error(message)
	};

	const throwSuccess = (message: string) => {
		successMessage = message;
		toast.success(message)
	};
</script>
<Toaster />


<Modal bind:open={intentModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar la intención <span class="font-bold"
				>{currentIntent}</span
			>? La acción es irreversible
		</h3>
		<Input type="text" name="bot" id="bot" class="hidden" value={currentIntent} />
		<Button color="red" class="me-2" type="submit" on:click={() => removeIntent(currentIntent)}
			>Sí, eliminar</Button
		>

		<Button color="alternative" on:click={() => (intentModal = false)}>No, cancelar</Button>
	</div>
</Modal>

<Modal bind:open={exampleModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar el mensaje <span class="font-bold"
				>{currentExample}</span
			>? La acción es irreversible
		</h3>
		<Input type="text" name="bot" id="bot" class="hidden" value={currentExample} />
		<Button color="red" class="me-2" type="submit" on:click={() => removeExample()}
			>Sí, eliminar</Button
		>

		<Button color="alternative" on:click={() => (exampleModal = false)}>No, cancelar</Button>
	</div>
</Modal>

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
					<BreadcrumbItem>Intenciones</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Intenciones del bot {data.bot}
			</h5>
			<p>
				Las intenciones son las acciones del usuario que el bot detecta y en base a las cuales toma
				decisiones sobre qué Respuesta dar. Para cada intención hay que definir múltiples ejemplos
				en lenguaje natural de cómo puede ser expresado dicho mensaje. Se recomiendan entre 5 y 20
				ejemplos por Intención.
			</p>
		</div>

		<ul
			class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
		>
			{#each data.intents as intent}
				<li
					class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
				>
					<div class="flex items-center space-x-4 rtl:space-x-reverse">
						<div class="flex-1 min-w-0">
							<p class="text-lg text-gray-700 group">
								{intent.intent}
								<button
									on:click={() => {
										if (edittingExample) {
											throwError('Termina de editar el mensaje');
											return;
										}
										createMode = true;
										currentIntent = intent.intent;
										const itemInput = document.getElementById(intent.intent + 'create');
										itemInput.hidden = !itemInput.hidden;
									}}><PlusOutline class="group-hover:visible invisible" /></button
								>
							</p>
							<ul
								class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
							>
								<li hidden id={intent.intent + 'create'}>
									<div>
										<form
											on:submit={() => {
												if (!createMode) return;
												if (!creatingExample) {
													throwError('No puedes dejar el mensaje vacío');
													return;
												}
												const itemInput = document.getElementById(currentIntent + 'create');
												intents
													.find((el) => el.intent === currentIntent)
													.examples.push(creatingExample);
												intents = intents;
												edittingExample = '';
												itemInput.hidden = !itemInput.hidden;
												creatingExample = '';
												createMode = false;
												throwSuccess("Mensaje creado correctamente");

											}}
										>
											<Input type="text" bind:value={creatingExample}>
												<button slot="right"
													><CheckOutline
														slot="right"
														class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-green-500"
													/></button
												>
											</Input>
										</form>
									</div>
								</li>
								{#each intent.examples as example, index}
									<li
										class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg group"
									>
										<div class="group" id={intent.intent + example}>
											{example}
											{#if intent.examples.length > 1}<button
												class="ml-2"
												on:click={() => {
													if (edittingExample) {
														throwError('Termina de editar el mensaje');
														return;
													}
													exampleModal = true;
													currentExample = example;
													currentIntent = intent.intent;
												}}>
												
												<TrashBinOutline class="group-hover:visible invisible" /></button
											>
											{/if}
											<button
												on:click={() => {
													if (edittingExample) {
														throwError('Termina de editar el mensaje');
														return;
													}
													editMode = true;
													currentExample = example;
													currentIntent = intent.intent;
													edittingExample = example;
													const item = document.getElementById(currentIntent + currentExample);
													const itemInput = document.getElementById(
														currentIntent + currentExample + 'input'
													);
													item.hidden = !item.hidden;
													itemInput.hidden = !itemInput.hidden;
												}}><EditOutline class="group-hover:visible invisible" /></button
											>
										</div>
										<div hidden id={intent.intent + example + 'input'}>
											<form
												on:submit={() => {
													if (!editMode) return;
													if (!edittingExample) {
														throwError('No puedes dejar el mensaje vacío');
														return;
													}
													const item = document.getElementById(currentIntent + currentExample);
													const itemInput = document.getElementById(
														currentIntent + currentExample + 'input'
													);

													intents.find((el) => el.intent === currentIntent).examples[index] =
														edittingExample;
													intents = intents;
													item.hidden = !item.hidden;
													itemInput.hidden = !itemInput.hidden;
													edittingExample = '';
													editMode = false;
													throwSuccess("Mensaje editado correctamente");

												}}
											>
												<Input type="text" bind:value={edittingExample}>
													<button slot="right"
														><CheckOutline
															slot="right"
															class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-green-500"
														/></button
													>
												</Input>
											</form>
										</div>
									</li>
								{/each}
							</ul>
						</div>
						<div
							class="group inline-flex items-start justify-start text-base font-semibold text-gray-900 dark:text-white h-auto"
						>
							<Button
								outline={true}
								class="!p-2"
								size="lg"
								on:click={() => {
									if (edittingExample) {
										throwError('Termina de editar el mensaje');
										return;
									}
									intentModal = true;
									currentIntent = intent.intent;
								}}
							>
								<TrashBinSolid class="w-5 h-5 text-primary-700 group-hover:text-white" />
							</Button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
		<form class="flex flex-col space-y-6" method="post" use:enhance action="?/save">
			<input type="text" hidden value={JSON.stringify(intents)} name="intents" />
			<Button color="green" type="submit">
				<ArchiveArrowDownSolid class="w-3.5 h-3.5 me-2" /> Guardar
			</Button>
		</form>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Crea una intención</h3>
			<Label class="space-y-2" for="name">
				<span>Nombre de la intención</span>
				<Input type="text" name="name" id="name" bind:value={intentName} />
			</Label>
			<Label class="space-y-2" for="description">
				<span>Mensaje de la intención</span>
				<Input type="text" name="description" id="desc" bind:value={intentContent} />
			</Label>
			<Button class="w-full" on:click={create}>Crear intención</Button>
		</div>
	</Card>
</div>