import { useMemo } from 'react';
import { useBoardStore } from "@/store/store-board";
import { AppColumn } from "./AppColumn";
import { DndContext, DragStartEvent, DragOverlay, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { Board, Todo } from '@/schemas';
import { createPortal } from 'react-dom';
import { AppTodo } from "./AppTodo";
import { useShallow } from 'zustand/react/shallow'

export function AppBoard() {

    const { boards, moveBoard, moveTodo, moveTodoOverBoard } = useBoardStore(useShallow((state) => ({
        boards: state.boards,
        moveBoard: state.moveBoard,
        moveTodo: state.moveTodo,
        moveTodoOverBoard: state.moveTodoOverBoard
    })))

    const boardId = useMemo(() => boards.map((board) => board.id), [boards])
    const [activeBoard, setActiveBoard] = useState<Board | null>(null)
    const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Board") {
            setActiveBoard(event.active.data.current.board)
            return;
        }
        if (event.active.data.current?.type === "Todo") {
            setActiveTodo(event.active.data.current.todo)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {

        setActiveBoard(null)
        setActiveTodo(null)

        const { active, over } = event
        if (!over) return;

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        const isActiveBoard = active.data.current?.type === "Board"
        if (isActiveBoard) {
            const activeBoardIndex = boards.findIndex((board) => board.id === activeId)
            const overBoardIndex = boards.findIndex((board) => board.id === overId)
            moveBoard(activeBoardIndex, overBoardIndex)
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return;

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        const isActiveTodo = active.data.current?.type === "Todo"

        const sourceBoardId = active.data.current?.boardId
        const targetBoardId = over.data.current?.boardId

        if (isActiveTodo && sourceBoardId == targetBoardId) {
            const board = boards.find((board) => board.id === sourceBoardId)
            const activeTodoIndex = board?.todos.findIndex((todo) => todo.id === active.id)
            const overTodoIndex = board?.todos.findIndex((todo) => todo.id === over.id)
            if (activeTodoIndex !== undefined && overTodoIndex !== undefined) {
                moveTodo(sourceBoardId, activeTodoIndex, overTodoIndex)
            }
        }

        if (isActiveTodo && sourceBoardId !== targetBoardId) {
            const board = boards.find((board) => board.id === sourceBoardId)
            const activeTodoIndex = board?.todos.findIndex((todo) => todo.id === active.id)
            const targetBoard = boards.find((board) => board.id === targetBoardId)
            const targetTodoIndex = targetBoard?.todos.findIndex((todo) => todo.id === over.id)
            if (activeTodoIndex !== undefined && targetTodoIndex !== undefined) {
                moveTodoOverBoard(sourceBoardId, targetBoardId, activeTodoIndex, targetTodoIndex)
            }
        }
    }



    return (
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
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
                    {activeTodo && <AppTodo todo={activeTodo} boardId={activeTodo.id} />}
                </DragOverlay>
                , document.body
            )}
        </DndContext>
    );
}
