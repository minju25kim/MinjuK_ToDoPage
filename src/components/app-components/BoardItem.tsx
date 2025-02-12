import { Todo } from "@/interface";
import { Pencil, Trash } from "lucide-react";
import { useBoardStore } from "@/store/store-board";

export function BoardItem({ todo, boardId }: { todo: Todo, boardId: string }) {
    const { removeTodo, editTodo } = useBoardStore()

    function handleEdit(boardId: string, todoId: string) {
        const newName = prompt("Enter new todo name");
        if (newName) {
            editTodo(boardId, todoId, newName);
        }
    }

    function handleDelete() {
        removeTodo(boardId, todo.id)
    }

    return (
        <div className="p-2 bg-gray-200 rounded-md text-center w-full relative">
            <div className="p-2">
                {todo.name}
            </div>
            <div className="hover:cursor-pointer absolute right-8 top-1/2 -translate-y-1/2" onClick={() => handleEdit(boardId, todo.id)}>
                <Pencil className="w-4 h-4" />
            </div>
            <div className="hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2" onClick={handleDelete}>
                <Trash className="w-4 h-4" />
            </div>
        </div>
    );
}


