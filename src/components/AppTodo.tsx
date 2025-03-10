import { GripVertical, Trash, Trash2 } from "lucide-react";
import { useBoardStore } from "@/store/store-board";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useShallow } from 'zustand/react/shallow'
import { Todo } from "@/schemas";

export function AppTodo({ todo, boardId }: { todo: Todo, boardId: string }) {
    const [editMode, setEditMode] = useState(false);
    const [isTrashHovered, setIsTrashHovered] = useState(false);
    const { removeTodo, editTodo } = useBoardStore(useShallow((state) => ({
        removeTodo: state.removeTodo,
        editTodo: state.editTodo
    })))

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
            <div className="px-6  h-full w-full overflow-y-auto break-words" onClick={() => setEditMode(true)}>
                {!editMode && todo.content}
                {editMode && (
                    <textarea
                        className="h-full w-full resize-none rounded bg-transparent focus:outline-none"
                        autoFocus
                        value={todo.content}
                        onBlur={() => { setEditMode(false) }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setEditMode(false);
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
            <div
                className="hover:cursor-pointer absolute right-2 bottom-0 -translate-y-1/2"
                onClick={handleDelete}
                onMouseEnter={() => setIsTrashHovered(true)}
                onMouseLeave={() => setIsTrashHovered(false)}>
                {isTrashHovered ? <Trash2 className="w-4 h-4" /> : <Trash className="w-4 h-4" />}
            </div>
        </div>
    );
}


