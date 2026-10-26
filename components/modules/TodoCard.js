"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiFlag,
  FiTag,
  FiMenu
} from "react-icons/fi";
import { format } from "date-fns";
import { deleteGuestTodo } from "@/utils/guestStorage";

const priorityStyles = {
  high: "bg-coral/15 text-coral",
  medium: "bg-ember/15 text-ember",
  low: "bg-tide/15 text-tide"
};

function TodoCard({
  todo,
  next,
  back,
  fetchTodos,
  columnKey,
  isGuest = false,
  onStatusChange
}) {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20
  });

  const onMove = e => {
    if (dragging) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const changeStatus = async status => {
    if (onStatusChange) {
      await onStatusChange(todo._id, status);
      return;
    }
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
    if (isGuest) {
      deleteGuestTodo(todo._id);
      setLoading(false);
      fetchTodos();
      return;
    }
    const res = await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id: todo._id }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "Success") fetchTodos();
  };

  const onDragStart = e => {
    setDragging(true);
    mx.set(0);
    my.set(0);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: todo._id, from: columnKey })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => setDragging(false);

  return (
    <motion.div
      ref={ref}
      layout
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{
        opacity: dragging ? 0.45 : 1,
        y: 0,
        rotateX: 0,
        scale: dragging ? 0.98 : 1
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={dragging ? undefined : { z: 40 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: dragging ? 0 : rx,
        rotateY: dragging ? 0 : ry,
        transformStyle: "preserve-3d",
        transformPerspective: 900
      }}
      className={`group relative mb-4 flex cursor-grab flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lift backdrop-blur-md transition-shadow active:cursor-grabbing hover:shadow-depth ${
        dragging ? "ring-2 ring-tide/40" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-tide-glow/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        style={{ transform: "translateZ(40px)" }}
      />

      <div
        className="flex items-start justify-between gap-2"
        style={{ transform: "translateZ(28px)" }}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <span className="mt-0.5 shrink-0 text-ink-mute/50" aria-hidden>
            <FiMenu size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-display text-base font-semibold text-ink">
              {todo.title}
            </h4>
            {todo.description && (
              <p className="mt-1 line-clamp-2 text-sm text-ink-mute">
                {todo.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className={`priority-chip ${
              priorityStyles[todo.priority] || priorityStyles.medium
            }`}
          >
            <FiFlag /> {todo.priority || "medium"}
          </div>
          <div className="flex items-center gap-1 text-ink-mute">
            <Link
              href={`/todo-details/${todo._id}`}
              draggable={false}
              onClick={e => e.stopPropagation()}
              className="rounded-lg p-1.5 transition-colors hover:bg-tide/10 hover:text-tide"
            >
              <FiEdit2 size={14} />
            </Link>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                deleteTodo();
              }}
              className="rounded-lg p-1.5 transition-colors hover:bg-coral/10 hover:text-coral"
              disabled={loading}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 text-[11px] text-ink-mute"
        style={{ transform: "translateZ(20px)" }}
      >
        {todo.dueDate && (
          <div className="inline-flex items-center gap-1 rounded-lg bg-mist-deep/70 px-2 py-1">
            <FiCalendar /> {format(new Date(todo.dueDate), "MMM d, yyyy")}
          </div>
        )}
        {todo.category && (
          <div className="inline-flex items-center gap-1 rounded-lg bg-tide/10 px-2 py-1 text-tide">
            <FiTag /> {todo.category}
          </div>
        )}
      </div>

      <div
        className="mt-1 flex items-center justify-between border-t border-ink/5 pt-3"
        style={{ transform: "translateZ(24px)" }}
      >
        <div>
          {back && (
            <button
              onClick={e => {
                e.stopPropagation();
                changeStatus(back);
              }}
              className="rounded-lg bg-mist-deep px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition-colors hover:bg-ink/10"
              disabled={loading}
            >
              Back
            </button>
          )}
        </div>
        <div>
          {next && (
            <button
              onClick={e => {
                e.stopPropagation();
                changeStatus(next);
              }}
              className="rounded-lg bg-tide px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-tide-bright hover:shadow-lift"
              disabled={loading}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TodoCard;
