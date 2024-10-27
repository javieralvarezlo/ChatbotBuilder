<script lang="ts">
	import {
		Button,
		Card,
		Input,
		Label,
		Breadcrumb,
		BreadcrumbItem,
		Modal,
		Toast,
		Select,
		Fileupload
	} from 'flowbite-svelte';
	import type { PageData } from '../escapp/$types';
	import {
		ArchiveArrowDownSolid,
		TrashBinSolid,
		ExclamationCircleOutline,
		TrashBinOutline,
		EditOutline,
		CheckOutline,
		CheckCircleSolid,
		PlusOutline
	} from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import { Toaster, toast } from 'svelte-french-toast';


	export let data: PageData;

	console.log(data.botImage)

	let selectedTheme: string = data.botInfo.customization.theme;
	let themes = data.themes;

	let errorMessage: string;

	let successMessage: string;

	$: responses = data.responses;

	const throwError = (message: string) => {
		errorMessage = message;
		toast.error(message);
	};

	const throwSuccess = (message: string) => {
		successMessage = message;
		toast.success(message);
	};

	let fileuploadprops = {
		id: 'profile'
	};

	const updateImage = () => {
		let fr = new FileReader();
		fr.onload = () => {
			document.getElementById('profileImage').src = fr.result;
		};

		fr.readAsDataURL(document.getElementById('profile').files[0]);
	};
</script>

<Toaster />

<div class="flex justify-evenly p-3">
	<Card padding="xl" size="lg" class="h-min">
		<div class="flex justify-between items-center mb-4 flex-col">
			<div class="w-full">
				<Breadcrumb aria-label="Default breadcrumb example">
					<BreadcrumbItem href="/bots" home>Home</BreadcrumbItem>
					<BreadcrumbItem href="/bots">Bots</BreadcrumbItem>
					<BreadcrumbItem><a href={`/bots/${data.bot}`}>{data.bot}</a></BreadcrumbItem>
					<BreadcrumbItem>Personalización</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mt-4 w-full mb-4">
				Personalización del bot
			</h5>
			<p>
				En esta sección se personaliza la apariencia del bot tales como el nombre del bot o su
				imagen de perfil.
			</p>
		</div>

		<form class="flex flex-col space-y-6" method="post" use:enhance action="?/save" enctype="multipart/form-data">
			<div class="">
				<Label for="name" class="block mb-2 text-md">Nombre del Bot</Label>
				<Input
					name="name"
					id="name"
					placeholder="Sospechoso"
					bind:value={data.botInfo.customization.name}
				/>
			</div>
			<div class="mb-6">
				<Label for="inspector" class="block mb-2 text-md">Nombre del usuario</Label>
				<Input
					name="inspector"
					id="inspector"
					placeholder="Inspector"
					bind:value={data.botInfo.customization.inspector}
				/>
			</div>
			<div class="mb-6">
				<Label for="theme" class="block mb-2 text-md"
					>Tema del chat
					<Select class="mt-2" name="theme" items={themes} bind:value={selectedTheme} />
				</Label>
			</div>
			<div class="mb-6">
				<Label for="profile" class="block mb-4 text-md"
					>Foto de perfil del Bot
					<img src={`data:image/png;base64,${data.botImage}`} alt="Foto de perfil" class="size-64" id="profileImage" />

					<Fileupload
						{...fileuploadprops}
						class="mt-2"
						accept="image/*"
						name="profile"
						id="profile"
						on:change={updateImage}
						enctype="multipart/form-data"
					/>
				</Label>
			</div>

			<Button color="green" type="submit">
				<ArchiveArrowDownSolid class="w-3.5 h-3.5 me-2" /> Guardar
			</Button>
		</form>
	</Card>
	<Card padding="xl" size="sm" class="h-min mb-2 bg-transparent border-none shadow-none">
	</Card>
</div>
