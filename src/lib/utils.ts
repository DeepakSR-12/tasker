import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractTasks = (board: Board) => {
  const tasks = [];

  for (const column of Array.from(board.columns.values())) {
    tasks.push(...column.todos);
  }

  return tasks;
};
