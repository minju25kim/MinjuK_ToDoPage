import { Todo } from "@/interface";
import { Trash } from "lucide-react";
import { useBoardStore } from "@/store/store-board";
import { useState } from "react";

export function AppTodo({ todo, boardId }: { todo: Todo, boardId: string }) {
    const [editMode, setEditMode] = useState(false);

    const { removeTodo, editTodo } = useBoardStore()

    function handleDelete() {
        removeTodo(boardId, todo.id)
    }

    return (
        <div className="p-2 bg-gray-200 rounded-md relative">
            <div className="h-full w-full">
                {!editMode && (
                    <div
                        className="text-ellipsis overflow-hidden min-h-[1rem]"
                        onClick={() => setEditMode(true)}>{todo.name}</div>
                )}
                {editMode && (
                    <textarea
                        className="h-full w-full resize-none border-none rounded
                        bg-transparent focus:outline-none"
                        autoFocus
                        value={todo.name}
                        onBlur={() => { setEditMode(false) }}
                        onKeyDown={(e) => {
                            if (e.shiftKey && e.key == "Enter") setEditMode(false);
                        }}
                        onChange={(e) => editTodo(boardId, todo.id, e.target.value)}
                    />
                )}
            </div>
            <div className="hover:cursor-pointer absolute right-2 bottom-0 -translate-y-1/2" onClick={handleDelete}>
                <Trash className="w-4 h-4" />
            </div>
        </div>
    );
}


