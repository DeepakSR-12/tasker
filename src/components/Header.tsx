"use client";

import Image from "next/image";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { useBoardStore } from "../store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "../lib/fetchSuggestion";
import { useModalStore } from "../store/ModalStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn, extractTasks } from "../lib/utils";
import { Montserrat } from "next/font/google";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
const font = Montserrat({ weight: "600", subsets: ["latin"] });

function Header() {
  const [board, searchString, setSearchString] = useBoardStore(
    ({ board, searchString, setSearchString }) => [
      board,
      searchString,
      setSearchString,
    ]
  );

  const [suggestion, setSuggestion] = useState<any[]>([]);
  const { openModal } = useModalStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    setTimeout(() => {
      fetchSuggestionFunc();
    }, 1000);
  }, [board]);

  const tasks = !!extractTasks(board)?.length;

  return (
    <header>
      <div className="flex items-center p-4">
        <Link href="/" className="flex items-center">
          <div
            onClick={() => router.push("/board")}
            className="relative h-8 w-8 mr-4"
          >
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", font.className)}>Tasker</h1>
        </Link>

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search */}

          {tasks ? (
            <form className="h-10 flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />

              <Input
                type="text"
                placeholder="Search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="flex-1 border-none"
              />

              <button type="submit" onClick={(e) => e.preventDefault()} hidden>
                Search
              </button>
            </form>
          ) : null}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of the Tasker
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground font-light text-center">
          Whip your tasks into shape, where productivity meets pure technology!
        </p>
      </div>

      {tasks ? (
        <div className="flex justify-center px-5 py-2 md:py-5 space-x-4">
          <p className="bg-white rounded-md shadow-md p-2 text-[#0055D1]">
            <UserCircleIcon
              className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
                loading ? "animate-spin" : ""
              }`}
            />
            {suggestion.length !== 0
              ? `You have ${
                  suggestion[0] === 1
                    ? "1 task to do"
                    : `${suggestion[0]} tasks to do`
                }, ${
                  suggestion[1] === 1
                    ? "1 task in progress"
                    : `${suggestion[1]} tasks in progress `
                } and ${
                  suggestion[2] === 1
                    ? "1 task done"
                    : `${suggestion[2]} tasks done`
                }`
              : "We are summarizing your tasks for the day"}
          </p>
          <div className="flex items-end justify-end p-2">
            <Button
              className="bg-white rounded-md shadow-md p-2 text-[#0055D1] flex items-center"
              onClick={openModal}
            >
              Add Task <PlusCircleIcon className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
