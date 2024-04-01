import { getAllUsers } from '$lib/services/users';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if(!user) {
		redirect(302, "/login")
	}
	return {
		users: await getAllUsers()
	};
};