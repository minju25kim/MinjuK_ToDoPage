"use client";

import { Button } from "../ui/button";
import { SideItem } from "./SideItem";
import { v4 as uuidv4 } from 'uuid';
import { Board } from "@/interface";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function Side() {
    const { selectBoard, addBoard, loadBoards } = useStore();
    const [boards, setBoards] = useState<Board[]>([]);

    function handleAddBoard() {
        const id = uuidv4();
        const newBoard: Board = { id: id, name: "New Board", todos: [{ id: uuidv4(), name: "New Todo1" }, { id: uuidv4(), name: "New Todo 2" }] };
        addBoard(newBoard);
        selectBoard(id);
    }

    useEffect(() => {
        setBoards(loadBoards());
    }, []);

    console.log(boards);

    return (
        <div className="grid grid-rows-[1fr_auto] bg-gray-100 rounded-md h-full overflow-hidden">
            <div className="flex flex-col gap-4 overflow-y-auto p-2">
                {boards.map((board) => (
                    <SideItem key={board.id} board={board} />
                ))}
            </div>
            <Button className="m-2" onClick={handleAddBoard}>Add Board</Button>
        </div>
    )
}

