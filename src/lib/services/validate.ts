import { z } from "zod"

export const validEmail = (email: string): boolean => {
    return z.string().email().safeParse(email).success;
}

export const validName = (name: string): boolean => {
    return z.string().min(3).max(24).safeParse(name).success;
}

export const validPassword = (password: string): boolean => {
    return z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/).safeParse(password).success
}


