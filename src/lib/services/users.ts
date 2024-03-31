import { db } from "$lib/prisma";

export const getAllUsers = async () => {
    return await db.user.findMany();
}