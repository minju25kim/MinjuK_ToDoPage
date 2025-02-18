import { Button } from "./ui/button";
import { useBoardStore } from "@/store/store-board";
import { v4 as uuidv4 } from 'uuid';
import { GripVertical, Trash, Trash2 } from "lucide-react";
import { AppTodo } from "./AppTodo";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useShallow } from 'zustand/react/shallow'
import { Board } from "@/schemas";

export function AppColumn({ board }: { board: Board }) {
    const [editMode, setEditMode] = useState(false);
    const [isTrashHovered, setIsTrashHovered] = useState(false);
    const { addTodo, editBoard, removeBoard } = useBoardStore(useShallow((state) => ({
        addTodo: state.addTodo,
        editBoard: state.editBoard,
        removeBoard: state.removeBoard
    })))

    const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
        id: board.id,
        data: {
            type: "Board",
            board,
            boardId: board.id
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return <div
            ref={setNodeRef}
            style={style}
            className=" bg-gray-100 rounded-md border border-gray-300 opacity-50"
        />
    }

    function handleAdd(boardId: string) {
        addTodo(boardId, uuidv4(), "Edit Todo Content")
    }


    function handleDelete() {
        const check = confirm("Are you sure you want to delete this board?");
        if (check) {
            removeBoard(board.id);
        }
    }

    return (
        <div
            key={board.id}
            className="grid grid-rows-[auto_1fr_auto] gap-2 bg-gray-100 rounded-md h-full overflow-hidden"
            ref={setNodeRef}
            style={style}
        >
            <div className="relative">
                <h1
                    className="max-h-[100px] overflow-auto border border-gray-300 rounded-md text-center break-words px-8 py-2 "
                    onClick={() => setEditMode(true)}
                >
                    {!editMode && `${board.name} (${board.todos.length} items)`}
                    {editMode && (
                        <input
                            autoFocus
                            value={board.name}
                            className="resize-none rounded bg-transparent focus:outline-none"
                            onChange={(e) => editBoard(board.id, e.target.value)}
                            onBlur={() => { setEditMode(false) }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") setEditMode(false);
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }} />
                    )}
                </h1>
                <div
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <div
                    className="hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleDelete}
                    onMouseEnter={() => setIsTrashHovered(true)}
                    onMouseLeave={() => setIsTrashHovered(false)}>
                    {isTrashHovered ? <Trash2 className="w-4 h-4" /> : <Trash className="w-4 h-4" />}
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
                {board.todos.map((todo) => (
                    <AppTodo key={todo.id} todo={todo} boardId={board.id} />
                ))}
            </div>
            <Button onClick={() => handleAdd(board.id)}>Add Todo</Button>

        </div >
    )
}