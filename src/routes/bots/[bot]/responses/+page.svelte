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
	import { Toaster, toast } from 'svelte-french-toast';

	export let data: PageData;

	let responseName: string;
	let responseContent: string;

	let responseModal: boolean;
	let currentResponse: string;

	let messageModal: boolean;
	let currentMessage: string;

	let edittingMessage: string;
	let creatingMessage: string;

	let createMode: boolean;
	let editMode: boolean;

	let errorMessage: string;

	let successMessage: string;

	$: responses = data.responses;

	const removeResponse = (response: any) => {
		delete responses[response];
		responses = responses;
		responseModal = false;
		throwSuccess('Respuesta eliminada correctamente');
	};

	const removeMessage = () => {
		let index;
		responses[currentResponse].map((el: any, idx: number) => {
			if (el.text === currentMessage) index = idx;
		});

		responses[currentResponse].splice(index, 1);
		responses = responses;
		messageModal = false;
		throwSuccess('Mensaje eliminado correctamente');
	};

	const create = () => {
		if (!responseName) {
			throwError('Debes indicar un nombre');
			return;
		}
		if (responses['utter_' + responseName]) {
			throwError('Ya existe una respuesta con ese nombre');
			return;
		}
		if (!responseContent) {
			throwError('Debes indicar un mensaje inicial');
			return;
		}
		responses['utter_' + responseName] = [{ text: responseContent }];
		responseName = '';
		responseContent = '';
		throwSuccess('Respuesta creada correctamente');
	};

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

<Modal bind:open={responseModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar la respuesta <span class="font-bold"
				>{currentResponse}</span
			>? La acción es irreversible
		</h3>
		<Input type="text" name="bot" id="bot" class="hidden" value={currentResponse} />
		<Button color="red" class="me-2" type="submit" on:click={() => removeResponse(currentResponse)}
			>Sí, eliminar</Button
		>

		<Button color="alternative" on:click={() => (responseModal = false)}>No, cancelar</Button>
	</div>
</Modal>

<Modal bind:open={messageModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Estás seguro de que quieres eliminar el mensaje <span class="font-bold"
				>{currentMessage}</span
			>? La acción es irreversible
		</h3>
		<Input type="text" name="bot" id="bot" class="hidden" value={currentMessage} />
		<Button color="red" class="me-2" type="submit" on:click={() => removeMessage()}
			>Sí, eliminar</Button
		>

		<Button color="alternative" on:click={() => (messageModal = false)}>No, cancelar</Button>
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
					<BreadcrumbItem>Respuestas</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Respuestas del bot {data.bot}
			</h5>
			<p>
				Las respuestas son cadenas de texto predefinidas usadas por el bot para responder al
				usuario. Para una misma respuesta se pueden definir varias cadenas de texto. Estas serán
				enviadas de forma aleatoria.
			</p>
		</div>

		<ul
			class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
		>
			{#each Object.keys(responses) as r}
				<li
					class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
				>
					<div class="flex items-center space-x-4 rtl:space-x-reverse">
						<div class="flex-1 min-w-0">
							<p class="text-lg text-gray-700 group">
								{r.split('utter_')[1]}

								<button
									on:click={() => {
										if (edittingMessage) {
											throwError('Termina de editar el mensaje');
											return;
										}
										createMode = true;
										currentResponse = r;
										const itemInput = document.getElementById(r + 'create');
										itemInput.hidden = !itemInput.hidden;
									}}><PlusOutline class="group-hover:visible invisible" /></button
								>
							</p>
							{#if r === 'utter_default'}
								<p>Esta respuesta se ejecuta cuando no se reconoce la intención del usuario</p>
							{/if}
							{#if r === 'utter_unlikely'}
								<p>
									Esta respuesta se ejecuta cuando la intención reconocida no encaja en ningún
									diálogo
								</p>
							{/if}

							<ul
								class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
							>
								{#each responses[r] as re, index}
									<li
										class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg group"
									>
										<div class="group" id={r + re.text}>
											{re.text}<button
												class="ml-2"
												on:click={() => {
													if (edittingMessage) {
														throwError('Termina de editar el mensaje');
														return;
													}
													messageModal = true;
													currentMessage = re.text;
													currentResponse = r;
												}}><TrashBinOutline class="group-hover:visible invisible" /></button
											>
											<button
												on:click={() => {
													if (edittingMessage) {
														throwError('Termina de editar el mensaje');
														return;
													}
													editMode = true;
													currentMessage = re.text;
													currentResponse = r;
													edittingMessage = re.text;
													const item = document.getElementById(currentResponse + currentMessage);
													const itemInput = document.getElementById(
														currentResponse + currentMessage + 'input'
													);
													item.hidden = !item.hidden;
													itemInput.hidden = !itemInput.hidden;
												}}><EditOutline class="group-hover:visible invisible" /></button
											>
										</div>
										<div hidden id={r + re.text + 'input'}>
											<form
												on:submit={() => {
													if (!editMode) return;
													if (!edittingMessage) {
														throwError('No puedes dejar el mensaje vacío');
														return;
													}
													const item = document.getElementById(currentResponse + currentMessage);
													const itemInput = document.getElementById(
														currentResponse + currentMessage + 'input'
													);
													responses[r][index].text = edittingMessage;
													responses = responses;
													item.hidden = !item.hidden;
													itemInput.hidden = !itemInput.hidden;
													edittingMessage = '';
													editMode = false;
													throwSuccess('Mensaje editado correctamente');
												}}
											>
												<Input type="text" bind:value={edittingMessage}>
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
								<li hidden id={r + 'create'}>
									<div>
										<form
											on:submit={() => {
												if (!createMode) return;
												if (!creatingMessage) {
													throwError('No puedes dejar el mensaje vacío');
													return;
												}
												const item = document.getElementById(currentResponse + currentMessage);
												const itemInput = document.getElementById(currentResponse + 'create');
												responses[r].push({ text: creatingMessage });
												responses = responses;
												edittingMessage = '';
												itemInput.hidden = !itemInput.hidden;
												creatingMessage = '';
												createMode = false;
												throwSuccess('Mensaje creado correctamente');
											}}
										>
											<Input type="text" bind:value={creatingMessage}>
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
							</ul>
						</div>
						<div
							class="group inline-flex items-start justify-start text-base font-semibold text-gray-900 dark:text-white h-auto"
						>
							{#if r !== 'utter_default' && r !== 'utter_unlikely'}
								<Button
									outline={true}
									class="!p-2"
									size="lg"
									on:click={() => {
										if (edittingMessage) {
											throwError('Termina de editar el mensaje');
											return;
										}
										responseModal = true;
										currentResponse = r;
									}}
								>
									<TrashBinSolid class="w-5 h-5 text-primary-700 group-hover:text-white" />
								</Button>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ul>
		<form class="flex flex-col space-y-6" method="post" use:enhance action="?/save">
			<input type="text" hidden value={JSON.stringify(responses)} name="responses" />
			<Button color="green" type="submit">
				<ArchiveArrowDownSolid class="w-3.5 h-3.5 me-2" /> Guardar
			</Button>
		</form>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Crea una respuesta</h3>
			<Label class="space-y-2" for="name">
				<span>Nombre de la respuesta</span>
				<Input type="text" name="name" id="name" bind:value={responseName} />
			</Label>
			<Label class="space-y-2" for="description">
				<span>Contenido de la respuesta</span>
				<Input type="text" name="description" id="desc" bind:value={responseContent} />
			</Label>
			<Button class="w-full" on:click={create}>Crear respuesta</Button>
		</div>
	</Card>
</div>
