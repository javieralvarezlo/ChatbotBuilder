<script lang="ts">
	import '../app.css';
	import type { PageData } from './$types';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import logo from '$lib/assets/logo.svg';

	import Fa from 'svelte-fa';
	import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		FileExportSolid
	} from 'flowbite-svelte-icons';

	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	$: activeUrl = $page.url.pathname;

	export let data: PageData;
</script>

<div class="fixed top-0 w-full z-50">
	<nav class="bg-gray-900 border-gray-200">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
				<img src={logo} class="h-8" alt="Flowbite Logo" />
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
									<span class="block text-sm text-gray-900 dark:text-white"
										>{data.user.email}
									</span>
								</div>
								<DropdownItem>
									<form method="POST">
										<button formaction="/logout" type="submit">Cerrar sesión</button>
									</form>
								</DropdownItem>
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
</div>
<div class="absolute top-16 w-full h-screen flex">
	{#if data.user}
		<Sidebar {activeUrl} class="fixed h-screen">
			<SidebarWrapper class="h-screen bg-gray-50 w-56">
				<SidebarGroup class="">
					<SidebarItem label="Inicio" href="/bots">
						<svelte:fragment slot="icon">
							<ChartPieSolid
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<!--<SidebarItem label="Kanban" {spanClass}>
						<svelte:fragment slot="icon">
							<GridSolid
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
						<svelte:fragment slot="subtext">
							<span
								class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"
							>
								Pro
							</span>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Inbox" {spanClass}>
						<svelte:fragment slot="icon">
							<MailBoxSolid
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
						<svelte:fragment slot="subtext">
							<span
								class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"
							>
								3
							</span>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem
						label="Sidebar"
						href="/docs/components/sidebar"
						active={activeUrl === '/docs/components/sidebar'}
					>
						<svelte:fragment slot="icon">
							<UserSolid
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Sign In">
						<svelte:fragment slot="icon">
							<ArrowRightToBracketOutline
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Sign Up">
						<svelte:fragment slot="icon">
							<FileExportSolid
								class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					-->
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	{/if}
	<main class="w-full ml-52">
		<slot />
	</main>
</div>
