'use client'

import { useBoardStore } from "@/store/store-board";
import { AppColumn } from "./AppColumn";

export function AppBoard() {
    const { boards } = useBoardStore()


    return (
        <div className="grid grid-rows-1 grid-flow-col auto-cols-[minmax(300px,1fr)] gap-2 h-full overflow-x-auto">
            {boards.map((board) => (
                <AppColumn key={board.id} board={board} />
            ))}
        </div>
    );
}
