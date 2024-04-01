<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import { Card, Button, Label, Input } from 'flowbite-svelte';
	import { Badge } from 'flowbite-svelte';
</script>

<div class="flex justify-center h-full pt-28">
	<Card class="h-min">
		<form class="flex flex-col space-y-6" method="post" use:enhance>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Inicia Sesión</h3>
			<Label class="space-y-2" for="email">
				<span>Email</span>
				<Input
					type="text"
					name="email"
					placeholder="email@ejemplo.com"
					id="email"
					value={$page.form?.email ?? ''}
				/>
			</Label>
			<Label class="space-y-2" for="password">
				<span>Contraseña</span>
				<Input
					type="password"
					name="password"
					placeholder="•••••"
					id="password"
					value={$page.form?.password}
				/>
			</Label>
			<Button type="submit" class="w-full">Iniciar sesión</Button>
			{#if $page.form?.incorrect}
				<Badge large color="red">Usuario o contraseña no válidos</Badge>
			{/if}
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				¿No estás registrado? <a href="/register"
					class="text-primary-700 hover:underline dark:text-primary-500"
				>
					Crea una nueva cuenta
			</a>
			</div>
		</form>
	</Card>
</div>
