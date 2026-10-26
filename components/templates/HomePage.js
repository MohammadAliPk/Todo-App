"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TodoCard from "../modules/TodoCard";
import TodoForm from "../modules/TodoForm";
import FilterBar from "../modules/FilterBar";
import { FiPlus } from "react-icons/fi";

const columns = [
  {
    key: "todo",
    title: "To Do",
    next: "inProgress",
    accent: "from-ink-mute/30 to-ink-mute/5",
    badge: "bg-ink/10 text-ink-soft"
  },
  {
    key: "inProgress",
    title: "In Progress",
    next: "review",
    back: "todo",
    accent: "from-tide/40 to-tide/5",
    badge: "bg-tide/15 text-tide"
  },
  {
    key: "review",
    title: "Review",
    next: "done",
    back: "inProgress",
    accent: "from-ember/40 to-ember/5",
    badge: "bg-ember/15 text-ember"
  },
  {
    key: "done",
    title: "Done",
    back: "review",
    accent: "from-tide-glow/40 to-tide-glow/5",
    badge: "bg-tide-glow/20 text-tide"
  }
];

/** Animation #2 — staggered Kanban columns + cards */
function HomePage() {
  const [todos, setTodos] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ priority: "all", search: "" });

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.status === "Success") {
      setTodos(data.data.todos);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filterTodos = list => {
    if (!list) return [];
    return list.filter(item => {
      if (filter.priority !== "all" && item.priority !== filter.priority)
        return false;
      if (
        filter.search &&
        !`${item.title} ${item.description || ""}`
          .toLowerCase()
          .includes(filter.search.toLowerCase())
      )
        return false;
      return true;
    });
  };

  const total =
    (todos.todo?.length || 0) +
    (todos.inProgress?.length || 0) +
    (todos.review?.length || 0) +
    (todos.done?.length || 0);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tide">
            Your workspace
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Flowboard
          </h2>
          <p className="mt-2 max-w-md text-ink-mute">
            {total} tasks in motion — drag momentum across the board and finish
            strong.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <FiPlus size={20} /> Add Task
        </motion.button>
      </motion.div>

      <FilterBar filter={filter} setFilter={setFilter} />

      <div className="scene-3d grid grid-cols-1 gap-5 overflow-x-auto pb-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col, i) => {
          const list = filterTodos(todos[col.key]);
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 36, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.12 + i * 0.08,
                type: "spring",
                stiffness: 160,
                damping: 18
              }}
              className="column-rail min-w-[260px]"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${col.accent}`}
              />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
                  {col.title}
                </h3>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-bold ${col.badge}`}
                >
                  {list.length}
                </span>
              </div>

              <div className="min-h-[120px] space-y-0">
                <AnimatePresence mode="popLayout">
                  {list.map(todo => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      next={col.next}
                      back={col.back}
                      fetchTodos={fetchTodos}
                    />
                  ))}
                </AnimatePresence>

                {list.length === 0 && (
                  <div className="rounded-xl border border-dashed border-ink/10 px-3 py-8 text-center text-xs text-ink-mute">
                    Empty lane — add a task to fill the flow.
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {showForm && (
        <TodoForm fetchTodos={fetchTodos} setShowForm={setShowForm} />
      )}
    </div>
  );
}

export default HomePage;
