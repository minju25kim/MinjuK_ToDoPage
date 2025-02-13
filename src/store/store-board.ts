import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Board } from '@/interface'
import { produce } from 'immer'
import { arrayMove } from '@dnd-kit/sortable'

type State = {
    boards: Board[]
}

type Actions = {
    addBoard: (newBoard: Board) => void,
    removeBoard: (boardId: string) => void,
    editBoardName: (boardId: string, newName: string) => void,
    addTodo: (boardId: string, todoId: string, todo: string) => void,
    removeTodo: (boardId: string, todoId: string) => void,
    editTodo: (boardId: string, todoId: string, newTodo: string) => void,
    moveBoard: (activeBoardIndex: number, overBoardIndex: number) => void
}

export const useBoardStore = create<State & Actions>()(
    persist(
        (set) => ({
            boards: [],
            addBoard: (newBoard: Board) =>
                set(produce((state: State) => {
                    state.boards.push(newBoard)
                })),
            removeBoard: (boardId: string) =>
                set(produce((state: State) => {
                    state.boards = state.boards.filter((board) => board.id !== boardId)
                })),
            editBoardName: (boardId: string, newName: string) =>
                set(produce((state: State) => {
                    const board = state.boards.find((b) => b.id === boardId)
                    if (board) board.name = newName
                })),
            addTodo: (boardId: string, todoId: string, todo: string) =>
                set(produce((state: State) => {
                    const board = state.boards.find((b) => b.id === boardId)
                    if (board) board.todos.push({ id: todoId, name: todo })
                })),
            removeTodo: (boardId: string, todoId: string) =>
                set(produce((state: State) => {
                    const board = state.boards.find((b) => b.id === boardId)
                    if (board) board.todos = board.todos.filter(t => t.id !== todoId)
                })),
            editTodo: (boardId: string, todoId: string, newTodo: string) =>
                set(produce((state: State) => {
                    const board = state.boards.find((b) => b.id === boardId)
                    if (board) {
                        const todo = board.todos.find(t => t.id === todoId)
                        if (todo) todo.name = newTodo
                    }
                })),
            moveBoard: (activeBoardIndex: number, overBoardIndex: number) =>
                set(produce((state: State) => {
                    state.boards = arrayMove(state.boards, activeBoardIndex, overBoardIndex)
                })),
        }),
        {
            name: 'boards',
        },
    ),
)