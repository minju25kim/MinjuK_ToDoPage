import { Board } from "@/components/app-components/Board";
import { Side } from "@/components/app-components/Side";

export default function Home() {

  return (
    <div className="p-4 grid grid-cols-[1fr_3fr] gap-2 h-screen">
      <Side />
      <Board />
    </div>
  );
}
