<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import { Card, Button, Label, Input } from 'flowbite-svelte';

	import { Badge } from 'flowbite-svelte';
</script>

<div class="flex justify-center h-full pt-28">
	<Card class="h-min">
		<form class="flex flex-col space-y-6" method="post" use:enhance>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">
				Registrate en nuestra plataforma
			</h3>
			<Label class="space-y-2" for="name">
				<span>Nombre</span>
				<Input type="text" name="name" placeholder="John Doe" id="name" />
			</Label>
			{#if $page.form?.invalid_name}
			<Badge class="text-left w-full text-md" color="red"
					>Debe contener entre 3 y 24 caracteres</Badge
				>
			{/if}
			<Label class="space-y-2" for="email">
				<span>Email</span>
				<Input type="text" name="email" placeholder="email@ejemplo.com" id="email" />
			</Label>
			{#if $page.form?.invalid_email}
			<Badge class="text-left w-full text-md" color="red">Email no válido</Badge>
			{/if}
			<Label class="space-y-2" for="password">
				<span>Contraseña</span>
				<Input type="password" name="password" placeholder="•••••" id="password" />
			</Label>
			<Label class="space-y-2" for="password2">
				<span>Repite Contraseña</span>
				<Input type="password" name="password2" placeholder="•••••" id="password2" />
			</Label>
			{#if $page.form?.invalid_password}
				<Badge class="text-left w-full text-md" color="red">Introduce una contraseña de al menos 6 caracteres, con una mayúsucla, un número y un caracter especial</Badge>
			{/if}
			{#if $page.form?.repeat}
			<Badge class="text-left w-full text-md" color="red">Las contraseñas no coinciden</Badge>
			{/if}
			<Button type="submit" class="w-full">Registrarse</Button>
		</form>
	</Card>
</div>
