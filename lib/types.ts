declare module "better-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null;
        role?: "admin" | "user";
    }
}