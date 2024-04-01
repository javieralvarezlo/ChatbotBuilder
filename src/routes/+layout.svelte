<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="container">
	<nav>
		<ul>
			<li>
				<strong>
					<a href="/"> Inicio </a>
				</strong>
			</li>
		</ul>
		<ul>
			{#if !data.user}
				<li><a href="/register">Register</a></li>
				<li><a href="/login" role="button">Login</a></li>
			{:else}
				<form method="POST">
					<li>
						<p>{data.user.name}, {data.user.email}</p>
						<button formaction="/logout" type="submit">Logout</button>
					</li>
				</form>
			{/if}
		</ul>
	</nav>
	<slot />
</div>
