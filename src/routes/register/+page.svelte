<script lang="ts">
	import { enhance } from "$app/forms";
    import { page } from '$app/stores';
</script>

<h1>Registrarse</h1>
<form method="post" use:enhance>
    <label for="name">Nombre</label>
	<input name="name" id="name" /><br />
	<label for="email">Email</label>
	<input name="email" id="email" /><br />
	<label for="password">Contraseña</label>
	<input type="password" name="password" id="password" /><br />
    <button>Registrarse</button>
    <p>{$page.error?.message}</p>
</form>