import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { arrayMove } from '@dnd-kit/sortable'
import { BoardSchema, TodoSchema, Board } from '@/schemas';

type State = {
    boards: Board[]
}

type Actions = {
    addBoard: (newBoard: Board) => void,
    removeBoard: (boardId: string) => void,
    editBoard: (boardId: string, newName: string) => void,
    moveBoard: (activeBoardIndex: number, overBoardIndex: number) => void,
    addTodo: (boardId: string, todoId: string, todo: string) => void,
    removeTodo: (boardId: string, todoId: string) => void,
    editTodo: (boardId: string, todoId: string, newTodo: string) => void,
    moveTodo: (boardId: string, activeIndex: number, overIndex: number) => void,
    moveTodoOverBoard: (sourceBoardId: string, targetBoardId: string, activeTodoIndex: number, targetTodoIndex: number) => void,
}

export const useBoardStore = create<State & Actions>()(
    persist(
        (set) => ({
            boards: [],
            addBoard: (newBoard: Board) =>
                set(produce((state: State) => {
                    try {
                        const validatedBoard = BoardSchema.parse(newBoard)
                        state.boards.push(validatedBoard)
                    } catch (error) {
                        console.error('Failed to add board:', error)
                    }
                })),
            removeBoard: (boardId: string) =>
                set(produce((state: State) => {
                    try {
                        state.boards = state.boards.filter((board) => board.id !== boardId)
                    } catch (error) {
                        console.error('Failed to remove board:', error)
                    }
                })),
            editBoard: (boardId: string, newName: string) =>
                set(produce((state: State) => {
                    try {
                        const board = state.boards.find((b) => b.id === boardId)
                        if (!board) throw new Error(`Board with id ${boardId} not found`)
                        board.name = newName
                    } catch (error) {
                        console.error('Failed to edit board name:', error)
                    }
                })),
            moveBoard: (activeBoardIndex: number, overBoardIndex: number) =>
                set(produce((state: State) => {
                    try {
                        if (activeBoardIndex < 0 || activeBoardIndex >= state.boards.length ||
                            overBoardIndex < 0 || overBoardIndex >= state.boards.length) {
                            throw new Error('Invalid board indices')
                        }
                        state.boards = arrayMove(state.boards, activeBoardIndex, overBoardIndex)
                    } catch (error) {
                        console.error('Failed to move board:', error)
                    }
                })),
            addTodo: (boardId: string, todoId: string, todo: string) =>
                set(produce((state: State) => {
                    try {
                        const board = state.boards.find((b) => b.id === boardId)
                        if (!board) throw new Error(`Board with id ${boardId} not found`)
                        const newTodo = { id: todoId, content: todo }
                        const validatedTodo = TodoSchema.parse(newTodo);
                        board.todos.push(validatedTodo)
                    } catch (error) {
                        console.error('Failed to add todo:', error)
                    }
                })),
            removeTodo: (boardId: string, todoId: string) =>
                set(produce((state: State) => {
                    try {
                        const board = state.boards.find((b) => b.id === boardId)
                        if (!board) throw new Error(`Board with id ${boardId} not found`)
                        board.todos = board.todos.filter(t => t.id !== todoId)
                    } catch (error) {
                        console.error('Failed to remove todo:', error)
                    }
                })),
            editTodo: (boardId: string, todoId: string, newTodo: string) =>
                set(produce((state: State) => {
                    try {
                        const board = state.boards.find((b) => b.id === boardId)
                        if (!board) throw new Error(`Board with id ${boardId} not found`)
                        const todo = board.todos.find(t => t.id === todoId)
                        if (!todo) throw new Error(`Todo with id ${todoId} not found`)
                        todo.content = newTodo
                    } catch (error) {
                        console.error('Failed to edit todo:', error)
                    }
                })),
            moveTodo: (boardId: string, activeIndex: number, overIndex: number) =>
                set(produce((state: State) => {
                    try {
                        const board = state.boards.find((b) => b.id === boardId)
                        if (!board) throw new Error(`Board with id ${boardId} not found`)
                        board.todos = arrayMove(board.todos, activeIndex, overIndex)
                    } catch (error) {
                        console.error('Failed to move todo:', error)
                    }
                })),
            moveTodoOverBoard: (sourceBoardId: string, targetBoardId: string, activeTodoIndex: number, targetTodoIndex: number) =>
                set(produce((state: State) => {
                    try {
                        const sourceBoard = state.boards.find((b) => b.id === sourceBoardId)
                        if (!sourceBoard) throw new Error(`Source board with id ${sourceBoardId} not found`)

                        const targetBoard = state.boards.find((b) => b.id === targetBoardId)
                        if (!targetBoard) throw new Error(`Target board with id ${targetBoardId} not found`)

                        if (activeTodoIndex < 0 || activeTodoIndex >= sourceBoard.todos.length) {
                            throw new Error('Invalid active todo index')
                        }

                        targetBoard.todos.splice(targetTodoIndex, 0, sourceBoard.todos[activeTodoIndex])
                        sourceBoard.todos = sourceBoard.todos.filter((_, index) => index !== activeTodoIndex)
                    } catch (error) {
                        console.error('Failed to move todo between boards:', error)
                    }
                }))
        }),
        {
            name: 'boards',
        },
    ),
)