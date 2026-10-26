"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TodoCard from "../modules/TodoCard";
import TodoForm from "../modules/TodoForm";
import FilterBar from "../modules/FilterBar";
import { FiPlus } from "react-icons/fi";
import { useSession } from "next-auth/react";
import {
  enableGuestMode,
  getSortedGuestTodos,
  isGuestClient,
  updateGuestTodoStatus
} from "@/utils/guestStorage";

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

const emptyBoard = {
  todo: [],
  inProgress: [],
  review: [],
  done: []
};

function HomePage() {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(false);
  const [todos, setTodos] = useState(emptyBoard);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ priority: "all", search: "" });
  const [dropTarget, setDropTarget] = useState(null);
  const [ready, setReady] = useState(false);

  const detectGuest = () =>
    isGuestClient() || Boolean(session?.user?.isGuest);

  const fetchTodos = async () => {
    if (detectGuest()) {
      enableGuestMode();
      setIsGuest(true);
      setTodos(getSortedGuestTodos());
      return;
    }

    setIsGuest(false);
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.status === "Success") {
      setTodos(data.data.todos);
    }
  };

  useEffect(() => {
    if (session?.user?.isGuest) enableGuestMode();
    fetchTodos().finally(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.isGuest]);

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

  const moveTodoOptimistic = (id, from, to) => {
    if (!from || !to || from === to) return;
    setTodos(prev => {
      const source = [...(prev[from] || [])];
      const idx = source.findIndex(t => t._id === id);
      if (idx === -1) return prev;
      const [item] = source.splice(idx, 1);
      const dest = [...(prev[to] || []), { ...item, status: to }];
      return { ...prev, [from]: source, [to]: dest };
    });
  };

  const persistStatus = async (id, from, toStatus) => {
    moveTodoOptimistic(id, from, toStatus);

    if (isGuestClient()) {
      updateGuestTodoStatus(id, toStatus);
      setTodos(getSortedGuestTodos());
      return;
    }

    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, status: toStatus }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.status !== "Success") {
      fetchTodos();
    }
  };

  const handleDrop = async (e, toStatus) => {
    e.preventDefault();
    setDropTarget(null);
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    const { id, from } = payload || {};
    if (!id || from === toStatus) return;
    await persistStatus(id, from, toStatus);
  };

  const total =
    (todos.todo?.length || 0) +
    (todos.inProgress?.length || 0) +
    (todos.review?.length || 0) +
    (todos.done?.length || 0);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-mute">
        Loading board...
      </div>
    );
  }

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
            {isGuest ? "Guest workspace · saved on this device" : "Your workspace"}
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Flowboard
          </h2>
          <p className="mt-2 max-w-md text-ink-mute">
            {total} tasks in motion — drag cards between columns to update
            status.
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
          const isOver = dropTarget === col.key;
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
              onDragOver={e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDropTarget(col.key);
              }}
              onDragLeave={e => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setDropTarget(null);
                }
              }}
              onDrop={e => handleDrop(e, col.key)}
              className={`column-rail min-w-[260px] transition-all ${
                isOver ? "border-tide/40 bg-tide/10 ring-2 ring-tide/30" : ""
              }`}
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
                      columnKey={col.key}
                      isGuest={isGuest}
                      fetchTodos={fetchTodos}
                      onStatusChange={(id, status) =>
                        persistStatus(id, col.key, status)
                      }
                    />
                  ))}
                </AnimatePresence>

                {list.length === 0 && (
                  <div
                    className={`rounded-xl border border-dashed px-3 py-8 text-center text-xs ${
                      isOver
                        ? "border-tide/40 text-tide"
                        : "border-ink/10 text-ink-mute"
                    }`}
                  >
                    {isOver
                      ? "Drop task here"
                      : "Empty lane — drag a task here."}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {showForm && (
        <TodoForm
          fetchTodos={fetchTodos}
          setShowForm={setShowForm}
          isGuest={isGuest}
        />
      )}
    </div>
  );
}

export default HomePage;
