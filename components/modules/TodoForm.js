"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from "react-icons/fi";
import { addGuestTodo } from "@/utils/guestStorage";

/** Animation #4 — spring modal with 3D flip-in */
function TodoForm({ fetchTodos, setShowForm, isGuest = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setCategory("General");
    setDueDate(new Date());
    fetchTodos();
    setShowForm(false);
  };

  const addHandler = async () => {
    if (!title || !status) return;
    setLoading(true);

    if (isGuest) {
      addGuestTodo({
        title,
        status,
        description,
        priority,
        category,
        dueDate
      });
      setLoading(false);
      resetAndClose();
      return;
    }

    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        status,
        description,
        priority,
        category,
        dueDate
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setLoading(false);
    if (data.status === "Success") {
      resetAndClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          role="dialog"
          aria-modal
          initial={{ opacity: 0, y: 40, rotateX: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, rotateX: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{ transformPerspective: 1100, transformStyle: "preserve-3d" }}
          className="glass-panel-strong relative z-10 w-full max-w-md rounded-3xl p-6"
        >
          <button
            onClick={() => setShowForm(false)}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-mute transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <FiX size={22} />
          </button>

          <h3 className="mb-1 font-display text-2xl font-bold text-ink">
            Add New Task
          </h3>
          <p className="mb-6 text-sm text-ink-mute">
            Drop it on the board and keep the flow moving.
          </p>

          <div className="space-y-4">
            <div>
              <label className="field-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="field-input"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="field-input h-24 resize-none"
                placeholder="Add details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="field-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="field-label">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="field-input"
                  placeholder="e.g. Work"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Due Date</label>
              <DatePicker
                selected={dueDate}
                onChange={date => setDueDate(date)}
                className="field-input"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={addHandler}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Adding..." : "Create Task"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TodoForm;
