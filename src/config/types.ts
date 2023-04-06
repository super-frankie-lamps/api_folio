export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
        }
    }
}
