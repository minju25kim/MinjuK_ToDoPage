'use client'

import { useMemo } from 'react';
import { useBoardStore } from "@/store/store-board";
import { AppColumn } from "./AppColumn";
import { DndContext, DragStartEvent, DragOverlay, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Board } from '@/interface';
import { createPortal } from 'react-dom';


export function AppBoard() {
    const { boards, moveBoard } = useBoardStore()
    const boardId = useMemo(() => boards.map((board) => board.id), [boards])
    const [activeBoard, setActiveBoard] = useState<Board | null>(null)

    function onDragStart(event: DragStartEvent) {
        // console.log("drag start", event)
        if (event.active.data.current?.type === "Board") {
            setActiveBoard(event.active.data.current.board)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        // console.log("drag end", event)
        const { active, over } = event
        if (!over) return;

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        const activeBoardIndex = boards.findIndex((board) => board.id === activeId)
        const overBoardIndex = boards.findIndex((board) => board.id === overId)
        moveBoard(activeBoardIndex, overBoardIndex)
    }



    return (
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="grid grid-rows-1 grid-flow-col auto-cols-[300px] gap-2 h-full overflow-x-auto">
                <SortableContext items={boardId}>
                    {boards.map((board) => (
                        <AppColumn key={board.id} board={board} />
                    ))}
                </SortableContext>
            </div>
            {typeof window !== 'undefined' && createPortal(
                <DragOverlay>
                    {activeBoard && <AppColumn board={activeBoard} />}
                </DragOverlay>
                , document.body
            )}
        </DndContext>
    );
}
