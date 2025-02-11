'use client'

import { useStore } from "@/lib/store";
import { Item } from "./Item";
import { Board } from "@/interface";

export function SideItem({ board }: { board: Board }) {
    const { selectBoard } = useStore()

    function handleClick() {
        selectBoard(board.id);
    }

    return (
        <div className="w-full flex flex-col gap-1">
            <h1 className="p-2 bg-gray-200 rounded-md text-center h-10 hover:cursor-pointer " onClick={handleClick}>
                {board.name}
            </h1>
            <div className=" border border-gray-200 rounded-md flex flex-col gap-2">
                {board.todos.map((todo) => (
                    <Item key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
    );
}
