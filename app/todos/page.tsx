import { TodoList } from "@/components/TodoList"
import { todos as todosTable, Todo } from "@/database/schema"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"

export default async function TodosPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return <p>You need to sign in to view your todos.</p>; //inauthenticated
    }

    const todos = await db.query.todos.findMany({
        where: (todos, { eq }) => eq(todos.userId, session.user.id),
        orderBy: (todos, { desc }) => desc(todos.createdAt)
    })
    // const todos: Todo[] = [
    //     {
    //         id: "qwerty",
    //         title: "Read React docs",
    //         completed: true,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         userId: "xyz"
    //     },
    //     {
    //         id: "uiop[]",
    //         title: "Read Next.js docs",
    //         completed: false,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         userId: "xyz"
    //     },
    //     {
    //         id: "abcdefg",
    //         title: "Finish CS 5356 homework",
    //         completed: false,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         userId: "xyz"
    //     }
        
    // ]

    return (
        <main className="py-8 px-4">
            <section className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Todos</h1>
                <TodoList todos={todos} />
            </section>
        </main>
    )
} 