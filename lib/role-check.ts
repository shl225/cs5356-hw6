import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";

export async function isAdmin(userId: string): Promise<boolean> {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
    
    return user?.role === "admin";
}