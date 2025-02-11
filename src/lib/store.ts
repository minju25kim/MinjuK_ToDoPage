import { create } from 'zustand'
import { Board } from '@/interface'

type State = {
    id: string
    board: Board
}

type Actions = {
    selectBoard: (board: string) => void
    addBoard: (board: Board) => void
    loadBoards: () => Board[]
    getBoard: (id: string) => Board
}


export const useStore = create<State & Actions>((set) => ({
    id: "",
    board: { id: "", name: "", todos: [] },
    selectBoard: (board: string) => set(() => ({ id: board })),
    addBoard: (board: Board) => {
        const boards = localStorage.getItem('boards');
        localStorage.setItem('boards', boards ? JSON.stringify([...JSON.parse(boards), board]) : JSON.stringify([board]));
        return set(() => ({ board: board }))
    },
    loadBoards: () => {
        const boards = localStorage.getItem('boards');
        return boards ? JSON.parse(boards) : [];
    },
    getBoard: (id: string) => {
        const boards = localStorage.getItem('boards');
        return boards ? JSON.parse(boards).find((board: Board) => board.id === id) : null;
    }
}))

