'use client'

import { useStore } from "@/lib/store";
// import { boardList } from "@/lib/dummy";
// import { Todo } from "./Todo";
import { Button } from "../ui/button";

export function Board() {
    const { id, getBoard } = useStore()
    const board = getBoard(id)
    return (
        <div className="grid grid-rows-[1fr_auto] bg-gray-100 rounded-md">
            <div className="p-2">
                <h1 className="p-2 bg-gray-200 rounded-md text-center h-10">
                    {/* {board && board.id} */}
                    {board && board.name}
                </h1>
                {board && board.todos.map((todo) => (
                    <div key={todo.id}>
                        {todo.name}
                    </div>
                ))}
            </div>
            <Button className="m-2">Add Todo</Button>
        </div>
    );
}
