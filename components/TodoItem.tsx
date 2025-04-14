import { Todo } from "@/database/schema";
import { Checkbox } from "@/components/ui/checkbox";

import { toggleTodo } from "@/actions/todos";
import { cn } from "@/lib/utils";

export function TodoItem({ todo }: { todo: Todo }) {

    const handleToggle = async () => {
        const formData = new FormData()
        formData.append("id", todo.id)
        await toggleTodo(formData)
    }

    return (
        <li
            key={todo.id}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2`}
        >
            <form action={handleToggle}>
                <input 
                    type="hidden" 
                    name="id" 
                    value={todo.id} 
                />
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={handleToggle}
                />
            </form>
            
           
            <span className={cn(
                    "flex-1",
                    todo.completed ? "line-through text-muted-foreground" : ""
                )}>
                {todo.title}
            </span>
        </li>
    )
}