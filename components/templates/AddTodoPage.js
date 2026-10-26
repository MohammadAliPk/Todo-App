"use client";

import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GrAddCircle } from "react-icons/gr";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { addGuestTodo, isGuestClient } from "@/utils/guestStorage";

function AddTodoPage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const addHandler = async () => {
    if (!title || !status) {
      toast.error("Please enter a title and select a status");
      return;
    }

    setLoading(true);
    try {
      if (isGuestClient()) {
        addGuestTodo({
          title,
          status,
          description,
          priority,
          category,
          dueDate
        });
        toast.success("Todo saved on this device");
      } else {
        const res = await axios.post("/api/todos", {
          title,
          status,
          description,
          priority,
          category,
          dueDate
        });
        toast.success(res.data.message || "Todo created successfully");
      }

      setTitle("");
      setStatus("todo");
      setDescription("");
      setPriority("medium");
      setCategory("General");
      setDueDate(new Date());
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to create todo";
      toast.error(errMsg);
    } finally {
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
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-tide to-tide-bright text-white"
            style={{
              boxShadow:
                "inset -3px -5px 10px rgba(0,0,0,0.12), 8px 12px 18px rgba(15,118,110,0.3)"
            }}
          >
            <GrAddCircle size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Add new task
            </h2>
            <p className="text-sm text-ink-mute">
              Create a detailed task with status, priority and due date.
            </p>
          </div>
        </div>

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
              placeholder="What do you want to accomplish?"
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
              placeholder="Add more context, checklist items or notes..."
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
                placeholder="e.g. Work, Personal"
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

          <div className="pt-2">
            <button
              type="button"
              onClick={addHandler}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creating..." : "Create task"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AddTodoPage;
