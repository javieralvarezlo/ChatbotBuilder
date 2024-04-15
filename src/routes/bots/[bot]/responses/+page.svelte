<script lang="ts">
	import {
		Button,
		Card,
		Input,
		Label,
		Breadcrumb,
		BreadcrumbItem
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { ArchiveArrowDownSolid, ThumbsUpSolid } from 'flowbite-svelte-icons';

	export let data: PageData;

	let responseName: string;
	let responseContent: string;

	$: responses = data.responses;

	const remove = (a: any) => {
		delete responses[a];
		responses = responses;
	};

	const create = () => {
		responses[responseName] = [{"text": responseContent}]
		responseName = "";
		responseContent = "";
	}
</script>

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
							<p class="text-lg text-gray-700">{r}</p>
							<ul
								class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
							>
								{#each responses[r] as re}
									<li
										class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
										on:click={() => remove(r)}
									>
										{re.text}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</li>
			{/each}
		</ul>
		<Button color="green">
			<ArchiveArrowDownSolid class="w-3.5 h-3.5 me-2" /> Guardar
		</Button>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2">
		<div class="flex flex-col space-y-6">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Crea una respuesta</h3>
			<Label class="space-y-2" for="name">
				<span>Nombre de la respuesta</span>
				<Input type="text" name="name" id="name" bind:value={responseName}/>
			</Label>
			<Label class="space-y-2" for="description">
				<span>Contenido de la respuesta</span>
				<Input type="text" name="description" id="desc" bind:value={responseContent}/>
			</Label>
			<Button class="w-full" on:click={create}>Crear bot</Button>
		</div>
	</Card>
</div>
