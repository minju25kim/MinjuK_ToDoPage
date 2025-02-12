'use client'

import { AppBoard } from "@/components/app-components/AppBoard";
import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/store/store-board";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from "sonner";

export default function Home() {

  const { boards, addBoard, removeBoard } = useBoardStore()

  function handleAddBoard() {
    const id = uuidv4()
    addBoard({ id: id, name: "Edit Board Name", todos: [] })
    toast.success("Board added", {
      description: "You can now add todos to this board",
      action: {
        label: "Undo",
        onClick: () => {
          removeBoard(id)
          toast.success("Board removed")
        }
      }
    })
  }

  return (
    <>
      <div className="p-2 h-screen grid grid-rows-[auto_1fr] gap-2 bg-gray-100 rounded-md">
        <Button onClick={() => handleAddBoard()}>Add Board</Button>
        <div className="grid grid-rows-1 grid-flow-col auto-cols-[minmax(300px,1fr)] gap-2 h-full overflow-x-auto">
          {boards.map((board) => (
            <AppBoard key={board.id} board={board} />
          ))}
        </div>
      </div>
      <Toaster />
    </>
  );
}
