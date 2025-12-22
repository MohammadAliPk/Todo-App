import { useState } from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiTag } from "react-icons/fi";
import { format } from "date-fns";

function TodoCard({ todo, next, back, fetchTodos }) {
  const [loading, setLoading] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-green-100 text-green-600"
  };

  const changeStatus = async status => {
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id: todo._id, status }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "Success") fetchTodos();
  };

  const deleteTodo = async () => {
    if (!window.confirm("Delete this task?")) return;
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id: todo._id }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "Success") fetchTodos();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 mb-4 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm md:text-base text-gray-800 truncate">
            {todo.title}
          </h4>
          {todo.description &&
            <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
              {todo.description}
            </p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${priorityColors[
              todo.priority
            ] || priorityColors.medium}`}
          >
            <FiFlag /> {todo.priority || "medium"}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Link
              href={`/todo-details/${todo._id}`}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <FiEdit2 />
            </Link>
            <button
              type="button"
              onClick={deleteTodo}
              className="p-1 rounded-md hover:bg-red-50 text-red-500"
              disabled={loading}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-gray-400">
        {todo.dueDate &&
          <div className="flex items-center gap-1">
            <FiCalendar /> {format(new Date(todo.dueDate), "MMM d, yyyy")}
          </div>}
        {todo.category &&
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <FiTag /> {todo.category}
          </div>}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
        <div className="flex gap-2">
          {back &&
            <button
              onClick={() => changeStatus(back)}
              className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md transition-colors"
              disabled={loading}
            >
              Back
            </button>}
        </div>
        <div className="flex gap-2">
          {next &&
            <button
              onClick={() => changeStatus(next)}
              className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
              disabled={loading}
            >
              Next
            </button>}
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
