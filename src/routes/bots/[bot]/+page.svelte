<script lang="ts">
	import {
		Button,
		Card,
		Helper,
		Input,
		Label,
		Listgroup,
		Avatar,
		Breadcrumb,
		BreadcrumbItem
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faComment, faLightbulb, faQuoteRight, faGamepad, faPalette } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;
</script>

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full">
				Propiedades del bot {data.bot}
			</h5>
		</div>
		<ul
			class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 border-0 dark:!bg-transparent"
		>
			<li
				class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
			>
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Fa icon={faQuoteRight} class="flex-shrink-0 text-xl" />
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${data.bot}/responses`}
							class="text-lg font-medium text-gray-900 truncate dark:text-white"
						>
							Respuestas
						</a>
					</div>
				</div>
			</li>
			<li
				class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
			>
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Fa icon={faLightbulb} class="flex-shrink-0 text-xl" />
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${data.bot}/intents`}
							class="text-lg font-medium text-gray-900 truncate dark:text-white"
						>
							Intenciones
						</a>
					</div>
				</div>
			</li>
			<li
				class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
			>
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Fa icon={faComment} class="flex-shrink-0 text-xl" />
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${data.bot}/dialogs`}
							class="text-lg font-medium text-gray-900 truncate dark:text-white"
						>
							Diálogos
						</a>
					</div>
				</div>
			</li>
			<li
				class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
			>
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Fa icon={faPalette} class="flex-shrink-0 text-xl" />
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${data.bot}/personalizacion`}
							class="text-lg font-medium text-gray-900 truncate dark:text-white"
						>
							Opciones de Personalización
						</a>
					</div>
				</div>
			</li>
			<li
				class="py-2 px-4 w-full text-sm font-medium list-none first:rounded-t-lg last:rounded-b-lg"
			>
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Fa icon={faGamepad} class="flex-shrink-0 text-xl" />
					<div class="flex-1 min-w-0">
						<a
							href={`/bots/${data.bot}/escapp`}
							class="text-lg font-medium text-gray-900 truncate dark:text-white"
						>
							Opciones de Escapp
						</a>
					</div>
				</div>
			</li>
		</ul>
	</Card>
	<Card padding="xl" size="sm" class="h-min bg-transparent border-none shadow-none" >

	</Card>
</div>
