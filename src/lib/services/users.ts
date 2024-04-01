import { db } from "$lib/server/db";
import type { User } from "lucia";

export const getAllUsers = async () => {
    return await db.user.findMany();
}

export const createUser = async (id: string, name: string, email: string, password: string) => {
    await db.user.create({
        data: {
            id,
            name,
            email,
            hashed_password: password
        }
    });
}

export const getUserByEmail = async (email: string) => {
    return await db.user.findUnique({
        where: {
            email
        }
    })
}