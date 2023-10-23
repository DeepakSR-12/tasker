"use client";

import { useBoardStore } from "../store/BoardStore";
import { useEffect } from "react";
import Column from "./Column";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useUser } from "@clerk/nextjs";
import Empty from "./empty";
import { extractTasks } from "../lib/utils";

function Board() {
  const { user } = useUser();
  const userId = user?.id;
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    ({ board, getBoard, setBoardState, updateTodoInDB }) => [
      board,
      getBoard,
      setBoardState,
      updateTodoInDB,
    ]
  );

  useEffect(() => {
    // get board
    if (userId) {
      getBoard(userId);
    }
  }, [userId, getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      // different column dragging
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      updateTodoInDB(todoMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <>
      {!!extractTasks(board)?.length ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable
            droppableId="board"
            direction="horizontal"
            type="column"
            isDropDisabled
          >
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Array.from(board.columns.entries()).map(
                  ([id, column], index) => (
                    <Column
                      key={id}
                      id={id}
                      todos={column.todos}
                      index={index}
                    />
                  )
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Empty label="No tasks created yet!" />
      )}
    </>
  );
}

export default Board;
