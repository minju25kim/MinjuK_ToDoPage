'use client'

import { AppBoard } from "@/components/AppBoard";
import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/store/store-board";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from "sonner";

export default function Home() {

  const { addBoard, removeBoard, boards } = useBoardStore()

  function handleAddBoard() {
    const id = uuidv4()
    addBoard({ id: id, name: `Board ${boards.length + 1}`, todos: [] })
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
      <div className="p-2 h-[100dvh] grid grid-rows-[auto_1fr] gap-2 bg-gray-100 rounded-md">
        <Button onClick={() => handleAddBoard()}>Add Board</Button>
        <AppBoard />
      </div>
      <Toaster />
    </>
  );
}
