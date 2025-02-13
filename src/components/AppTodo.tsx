import { Todo } from "@/interface";
import { GripVertical, Trash } from "lucide-react";
import { useBoardStore } from "@/store/store-board";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function AppTodo({ todo, boardId }: { todo: Todo, boardId: string }) {
    const [editMode, setEditMode] = useState(false);

    const { removeTodo, editTodo } = useBoardStore()

    const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
        id: todo.id,
        data: {
            type: "Todo",
            todo,
            boardId
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-50 min-h-[200px] h-[200px] w-[300px] bg-gray-200 rounded-md" />

        )
    }

    function handleDelete() {
        removeTodo(boardId, todo.id)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-2 bg-gray-200 rounded-md relative min-h-[200px] h-[200px] w-[300px]"
        >
            <div className="h-full w-full pl-6 overflow-y-auto" onClick={() => setEditMode(true)}>
                {!editMode && todo.name}
                {editMode && (
                    <textarea
                        className="h-full w-full resize-none rounded bg-transparent focus:outline-none border-2 border-gray-300 "
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
            <div
                className="absolute left-2 top-1/2 -translate-y-1/2"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-4 h-4" />
            </div>
            <div className="hover:cursor-pointer absolute right-2 bottom-0 -translate-y-1/2" onClick={handleDelete}>
                <Trash className="w-4 h-4" />
            </div>
        </div>
    );
}


