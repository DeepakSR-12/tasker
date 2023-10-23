"use client";

import { FormEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "../store/ModalStore";
import { useBoardStore } from "../store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function Modal() {
  const {
    addTask,
    newTaskDescription,
    setNewTaskDescription,
    newTaskType,
    newTaskInput,
    setNewTaskInput,
  } = useBoardStore();

  const [isOpen, closeModal] = useModalStore(({ isOpen, closeModal }) => [
    isOpen,
    closeModal,
    ,
  ]);

  const { user } = useUser();
  const userId = user?.id;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    try {
      if (userId)
        await addTask(newTaskInput, newTaskType, userId, newTaskDescription);
      toast.success("New task has been created!");
    } catch (err) {
      toast.error("Something went wrong creating a new task");
    }

    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        onSubmit={handleSubmit}
        className="relative z-10"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25  " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>

                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter description here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                <TaskTypeRadioGroup />

                <div>
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="bg-blue-100 text-blue-900 p-2 rounded-md focus-visible:ring-2 focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2 disabled:text-gray-300 disabled:bg-gray-100"
                      disabled={!newTaskInput}
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
