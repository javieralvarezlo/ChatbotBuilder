export const emailToPath = (email: string | undefined): string => {
    return email?.replace('@', '') || "";
}