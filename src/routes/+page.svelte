<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Welcome to SvealteKit</h1>
<p>Visita <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<h1>Usuarios:</h1>
{#each data.users as user}
    <p>{user.name}</p>
    <p>{user.email}</p>
{/each}