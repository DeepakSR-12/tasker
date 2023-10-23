import { create } from "zustand";
import { getTodosGroupedByColumns } from "../lib/getTodosGroupedByColumn";
import { databases, ID } from "@/appwrite";
import { Models } from "appwrite";

interface BoardState {
  board: Board;
  getBoard: (userId: string) => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (task: TypedColumn) => void;

  newTaskDescription: string;
  setNewTaskDescription: (description: string) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (
    todo: string,
    columnId: TypedColumn,
    userId: string,
    description?: string
  ) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  newTaskInput: "",
  newTaskType: "todo",
  newTaskDescription: "",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (task) => set({ newTaskType: task }),
  setNewTaskDescription: (description: string) =>
    set({ newTaskDescription: description }),
  getBoard: async (userId) => {
    const board = await getTodosGroupedByColumns(userId);
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  addTask: async (
    todo: string,
    columnId: TypedColumn,
    userId: string,
    description?: string
  ) => {
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        userId,
        ...(description && { description }),
      }
    );

    set({ newTaskInput: "" });
    set({ newTaskDescription: "" });
    set({ newTaskType: "todo" });
    set(({ board }) => {
      const newColumns = new Map(board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        userId,
        ...(description && { description }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
