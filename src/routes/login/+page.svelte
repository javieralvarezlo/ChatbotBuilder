<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<h1>Iniciar Sesión</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" /><br />
	<label for="password">Contraseña</label>
	<input type="password" name="password" id="password" /><br />
	<button>Iniciar Sesión</button>
</form>