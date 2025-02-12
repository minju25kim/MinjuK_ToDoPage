import { Button } from "./ui/button";
import { Board } from "@/interface";
import { useBoardStore } from "@/store/store-board";
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash } from "lucide-react";
import { AppTodo } from "./AppTodo";
import { useState } from "react";

export function AppColumn({ board }: { board: Board }) {
    const [editMode, setEditMode] = useState(false);

    const { addTodo, editBoardName, removeBoard } = useBoardStore()


    function handleAdd(boardId: string) {
        addTodo(boardId, uuidv4(), "Edit Todo Name")
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
        <div key={board.id} className="grid grid-rows-[auto_1fr_auto] gap-2 bg-gray-100 rounded-md h-full overflow-hidden">
            <div className="relative">
                <h1 className="p-2 border border-gray-300 rounded-md text-center" onClick={() => setEditMode(true)}>
                    {!editMode && `${board.name} (${board.todos.length} items)`}
                    {editMode && (
                        <input autoFocus
                        value={board.name}
                        onChange={(e)=> editBoardName(board.id, e.target.value)}
                        onBlur={()=>{setEditMode(false)}}
                        onKeyDown={(e)=>{
                            if (e.key !== "Enter") return;
                            setEditMode(false);
                        }}/>
                    )}
                </h1>
                <div className="hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2" onClick={handleDelete}>
                    <Trash className="w-4 h-4" />
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