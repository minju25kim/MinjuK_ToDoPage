import { Todo } from "@/interface";

export function Item({ todo }: { todo: Todo }) {
    return (
        <div className="text-center">
            {todo.name}
        </div>
    );
}


