"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LuPencilLine } from "react-icons/lu";
import { FiCalendar, FiFlag, FiTag, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteGuestTodo, updateGuestTodo } from "@/utils/guestStorage";

function DetailsPage({ data, isGuest = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description || "");
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority || "medium");
  const [category, setCategory] = useState(data.category || "General");
  const [dueDate, setDueDate] = useState(
    data.dueDate ? new Date(data.dueDate) : new Date()
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const id = data._id;

  const priorityColors = {
    high: "bg-coral/15 text-coral",
    medium: "bg-ember/15 text-ember",
    low: "bg-tide/15 text-tide"
  };

  const statusLabel = {
    todo: "To do",
    inProgress: "In progress",
    review: "Review",
    done: "Done"
  };

  const editHandler = async () => {
    if (!title || !status) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      if (isGuest) {
        updateGuestTodo(id, {
          title,
          description,
          status,
          priority,
          category,
          dueDate
        });
        toast.success("Todo updated (saved locally)");
        setIsEditing(false);
        return;
      }

      const res = await axios.post("/api/edit", {
        title,
        description,
        status,
        id,
        priority,
        category,
        dueDate
      });
      const resData = res.data;
      toast.success(resData.message || "Todo updated successfully");
      setIsEditing(false);
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to update todo";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      if (isGuest) {
        deleteGuestTodo(id);
        toast.success("Todo deleted");
        router.replace("/");
        return;
      }

      const res = await axios.delete("/api/todos", {
        data: { id }
      });
      const resData = res.data;
      toast.success(resData.message || "Todo deleted");
      router.replace("/");
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to delete todo";
      toast.error(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-2">
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ transformPerspective: 1000 }}
        className="glass-panel-strong w-full max-w-2xl rounded-3xl p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
              Task
            </p>
            <h2 className="font-display text-2xl font-bold text-ink">
              {isEditing ? "Edit task" : "Task details"}
            </h2>
            <p className="mt-1 text-sm text-ink-mute">
              {isEditing
                ? "Update the task information and save your changes."
                : "Review your task details or switch to edit mode."}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-ghost bg-tide/10 text-tide"
              >
                <LuPencilLine size={14} /> Edit
              </button>
            )}
            <button
              type="button"
              onClick={deleteHandler}
              disabled={loading}
              className="btn-danger"
            >
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-5">
            <div>
              <h3 className="mb-1 font-display text-xl font-semibold text-ink">
                {data.title}
              </h3>
              {data.description && (
                <p className="whitespace-pre-line text-sm text-ink-mute">
                  {data.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center rounded-lg bg-mist-deep px-2 py-1 font-medium text-ink-soft">
                {statusLabel[data.status] || data.status}
              </span>
              <span
                className={`priority-chip ${
                  priorityColors[data.priority] || priorityColors.medium
                }`}
              >
                <FiFlag /> {data.priority || "medium"}
              </span>
              {data.category && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-tide/10 px-2 py-1 text-tide">
                  <FiTag />
                  {data.category}
                </span>
              )}
              {data.dueDate && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-ember/10 px-2 py-1 text-ember">
                  <FiCalendar />
                  {new Date(data.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="field-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="description" className="field-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="field-input min-h-[90px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="field-label">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="field-input"
                >
                  <option value="todo">To do</option>
                  <option value="inProgress">In progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

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
                />
              </div>
            </div>

            <div>
              <label className="field-label">Due date</label>
              <DatePicker
                selected={dueDate}
                onChange={date => setDueDate(date || new Date())}
                className="field-input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editHandler}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default DetailsPage;
