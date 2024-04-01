import { lucia } from "$lib/server/auth"
import { Argon2id } from "oslo/password";

export const createSession = async (userId: string) => {
    return await lucia.createSession(userId, {})
}

export const createSessionCookie = (sessionId: string) => {
    return lucia.createSessionCookie(sessionId);
}

export const hashPassword = async (password: string) => {
    return await new Argon2id().hash(password);
}

export const verifyPassword = async (password: string, hash: string) => {
    return await new Argon2id().verify(hash, password);
}

export const invalidateSession = async (sessionId: string) => {
    await lucia.invalidateSession(sessionId);
}

export const createBlankSessionCookie = () => {
    return lucia.createBlankSessionCookie();
}