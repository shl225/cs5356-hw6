"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Todo } from "@/database/schema"

import { TodoItem } from "./TodoItem"

import { useActionState } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { createTodo } from "@/actions/todos"

export function TodoList({ todos }: { todos: Todo[] }) {

    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await createTodo(formData)

        if (result.error) {
            toast.error(result.error)
            return result
        }
        //clearing input field
        const inputElement = document.querySelector('input[name="title"]') as HTMLInputElement
        if (inputElement) inputElement.value = ""

        return result
    }, null)

    return (
        <div className="space-y-4">
            <form className="flex gap-2 items-stretch" action={formAction}>
                <Input
                    name="title"
                    placeholder={"Add a new todo..."}
                    className={state?.fieldErrors?.title ? "border-destructive" : ""}
                />
                <Button type="submit">
                    Add
                </Button>
            </form>
            {state?.fieldErrors?.title && (
                <p className="text-destructive text-sm">
                    {state.fieldErrors.title[0]}
                </p>
            )}
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    )
} 