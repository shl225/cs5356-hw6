"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { todos } from "@/database/schema"

import { insertTodoSchema } from "@/database/schema/todos"

export async function createTodo(formData: FormData) {
    /* YOUR CODE HERE */
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string

    const validationResult = insertTodoSchema.safeParse({ 
        title, 
        userId: session.user.id 
    })

    if (!validationResult.success) {
        return { 
            error: validationResult.error.errors[0].message,
            fieldErrors: validationResult.error.flatten().fieldErrors 
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    await db.insert(todos).values({
        title,
        userId: session.user.id
    })

    revalidatePath("/todos")
    return { success: true }
}

export async function toggleTodo(formData: FormData) {
    /* YOUR CODE HERE */
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { error: "Unauthorized" }
    }

    const id = formData.get("id") as string

    // Defensive programming: only allow toggling of user's own todos
    const todo = await db.query.todos.findFirst({
        where: (todos, { eq }) => eq(todos.id, id) 
    })

    if (!todo || todo.userId !== session.user.id) {
        return { error: "Unauthorized to toggle this todo" }
    }

    await db.update(todos)
        .set({ 
            completed: !todo.completed,
            updatedAt: new Date() 
        })
        .where(eq(todos.id, id))

    revalidatePath("/todos")
    return { success: true }
}

export async function deleteTodo(formData: FormData) {
    /* YOUR AUTHORIZATION CHECK HERE */
    const session = await auth.api.getSession({
        headers: await headers()
    });

    //checking if user is admin
    if (!session || session.user.role !== 'admin') {
        return { error: "Unauthorized: Only admins can delete todos" };
    }

    const id = formData.get("id") as string;

    try {
        await db.delete(todos).where(eq(todos.id, id));
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete todo" };
    }

    // const id = formData.get("id") as string;
    // await db.delete(todos)
    //     .where(eq(todos.id, id));

    // revalidatePath("/admin");
}
