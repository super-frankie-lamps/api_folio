export const JWT_SECRET = process.env.JWT_SECRET!;

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
        }
    }
}
