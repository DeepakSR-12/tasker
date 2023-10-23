import formatTodo from "./formatTodo";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodo(board);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const data = await res.json();

  if (data) {
    return [data.todos.todo, data.todos.inprogress, data.todos.done];
  } else {
    return [];
  }
};

export default fetchSuggestion;
