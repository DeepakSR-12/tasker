"use client";

import { XCircleIcon } from "@heroicons/react/20/solid";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { useBoardStore } from "../store/BoardStore";
import { toast } from "sonner";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export default function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const { deleteTask } = useBoardStore();

  const deleteItem = async () => {
    try {
      await deleteTask(index, todo, id);
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Something went wrong deleting!");
    }
  };

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p className="font-semibold">{todo.title}</p>
        <button
          onClick={deleteItem}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      <div className="px-5 pb-5 text-sm">
        {todo.description && <p>{todo.description}</p>}
      </div>
    </div>
  );
}
