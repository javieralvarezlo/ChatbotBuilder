import { getAllUsers } from '$lib/services/users';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		users: await getAllUsers()
	};
};