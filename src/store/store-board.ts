import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Board } from '@/interface'

type State = {
    id: string
    boards: Board[]
}

type Actions = {
    addBoard: (newBoard: Board) => void,
    removeBoard: (boardId: string) => void,
    editBoardName: (boardId: string, newName: string) => void,
    moveBoard: (boardId: string, newIndex: number) => void,
    addTodo: (boardId: string, todoId: string, todo: string) => void,
    removeTodo: (boardId: string, todoId: string) => void,
    editTodo: (boardId: string, todoId: string, newTodo: string) => void
}

export const useBoardStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            id: "",
            boards: [],
            addBoard: (newBoard: Board) => set({ boards: [...get().boards, newBoard] }),
            removeBoard: (boardId: string) => set({ boards: get().boards.filter((board) => board.id !== boardId) }),
            editBoardName: (boardId: string, newName: string) =>
                set({ id: boardId, boards: get().boards.map((board) => board.id === boardId ? { ...board, name: newName } : board) }),
            moveBoard: (boardId: string, newIndex: number) => {
                const { boards } = get()
                const updatedBoards = [...boards]
                const index = updatedBoards.findIndex(b => b.id === boardId)
                updatedBoards.splice(index, 1)
                updatedBoards.splice(newIndex, 0, updatedBoards[index])
                set({ boards: updatedBoards })
            },
            addTodo: (boardId: string, todoId: string, todo: string) => {
                const { boards } = get()
                const updatedBoards = [...boards]
                const index = updatedBoards.findIndex(b => b.id === boardId)
                updatedBoards[index].todos.push({ id: todoId, name: todo })
                set({ boards: updatedBoards })
            },
            removeTodo: (boardId: string, todoId: string) => {
                const { boards } = get()
                const updatedBoards = [...boards]
                const index = updatedBoards.findIndex(b => b.id === boardId)
                updatedBoards[index].todos = updatedBoards[index].todos.filter(t => t.id !== todoId)
                set({ boards: updatedBoards })
            },
            editTodo: (boardId: string, todoId: string, newTodo: string) => {
                const { boards } = get()
                const updatedBoards = [...boards]
                const index = updatedBoards.findIndex(b => b.id === boardId)
                updatedBoards[index].todos = updatedBoards[index].todos.map(t => t.id === todoId ? { ...t, name: newTodo } : t)
                set({ boards: updatedBoards })
            },
        }),
        {
            name: 'boards',
        },
    ),
)