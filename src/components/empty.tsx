import { useModalStore } from "../store/ModalStore";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Button } from "./ui/button";

interface EmptyProps {
  label: string;
}

const Empty = ({ label }: EmptyProps) => {
  const { openModal } = useModalStore();
  return (
    <div className="h-full p-20 flex flex-col justify-center items-center">
      <div className="relative w-72 h-72">
        <Image alt="empty" src="/empty.png" fill />
      </div>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
      <div className="flex items-end justify-end p-2">
        <Button
          className="bg-white rounded-md shadow-md p-2 text-[#0055D1] flex items-center"
          onClick={openModal}
        >
          Add Task <PlusCircleIcon className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Empty;
