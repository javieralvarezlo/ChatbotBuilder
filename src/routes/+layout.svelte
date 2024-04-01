<script lang="ts">
	import '../app.css';
	import type { PageData } from './$types';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	import Fa from 'svelte-fa';
	import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;
</script>

<nav class="bg-gray-900 border-gray-200">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap text-white"
				>Chatbot Generator</span
			>
		</a>
		<div class="hidden w-full md:block md:w-auto" id="navbar-default">
			<ul
				class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-800 rounded-lg bg-gray-900 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				{#if data.user}
					<li>
						<a
							href="/"
							class="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:text-blue-500 hover:text-white md:dark:hover:bg-transparent"
							aria-current="page">Inicio</a
						>
					</li>
					<li>
						<p
							class="group block py-2 px-3 rounded cursor-pointer hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:text-blue-500 hover:text-white md:dark:hover:bg-transparent"
						>
							{data.user.name}
							<Fa
								icon={faCaretDown}
								class="w-3 h-3 ms-2 text-white dark:text-white inline-block group-hover:text-blue-700"
							/>
						</p>
						<Dropdown>
							<div slot="header" class="px-4 py-2">
								<span class="block text-sm text-gray-900 dark:text-white">{data.user.email} </span>
							</div>
							<DropdownItem
								><form method="POST">
									<button formaction="/logout" type="submit">Cerrar sesión</button>
								</form></DropdownItem
							>
						</Dropdown>
					</li>
				{:else}
					<li>
						<a
							href="/register"
							class="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:text-blue-500 hover:text-white md:dark:hover:bg-transparent"
							aria-current="page">Registrarse</a
						>
					</li>
					<li>
						<a
							href="/login"
							class="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:text-blue-500 hover:text-white md:dark:hover:bg-transparent"
							aria-current="page">Iniciar Sesión</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
<main class="h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-800">
	<slot />
</main>
