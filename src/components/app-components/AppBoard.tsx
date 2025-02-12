'use client'

import { useBoardStore } from "@/store/store-board";
import { Button } from "../ui/button";
import { BoardItem } from "./BoardItem";
import { v4 as uuidv4 } from 'uuid';
import { Board } from "@/interface";
import { Trash, Pencil } from "lucide-react";

export function AppBoard({ board }: { board: Board }) {
    const { addTodo, editBoardName, removeBoard } = useBoardStore()

    function handleAdd(boardId: string) {
        addTodo(boardId, uuidv4(), "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.")
    }

    function handleEdit(id: string) {
        const newName = prompt("Enter new board name");
        if (newName) {
            editBoardName(id, newName);
        }
    }

    function handleDelete() {
        const check = confirm("Are you sure you want to delete this board?");
        if (check) {
            removeBoard(board.id);
        }
    }

    return (
        <div className="grid grid-rows-[auto_1fr_auto] gap-2 bg-gray-100 rounded-md h-full overflow-hidden">
            <div className="relative">
                <h1 className="p-2 border border-gray-300 rounded-md text-center">
                    {board.name} ({board.todos.length} items)
                </h1>
                <div className="hover:cursor-pointer absolute right-8 top-1/2 -translate-y-1/2" onClick={() => handleEdit(board.id)}>
                    <Pencil className="w-4 h-4" />
                </div>
                <div className="hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2" onClick={handleDelete}>
                    <Trash className="w-4 h-4" />
                </div>
            </div>
            <div className="flex flex-wrap gap-2 overflow-y-auto">
                {board.todos.map((todo) => (
                    <BoardItem key={todo.id} todo={todo} boardId={board.id} />
                ))}
            </div>
            <Button onClick={() => handleAdd(board.id)}>Add Todo</Button>
        </div>
    );
}
