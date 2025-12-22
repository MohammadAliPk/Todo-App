'use client';

import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GrAddCircle } from "react-icons/gr";
import { toast } from "react-toastify";

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
      const res = await axios.post("/api/todos", {
        title,
        status,
        description,
        priority,
        category,
        dueDate,
      });
      toast.success(res.data.message || "Todo created successfully");

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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <GrAddCircle size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add new task</h2>
            <p className="text-sm text-gray-500">
              Create a detailed task with status, priority and due date.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="What do you want to accomplish?"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm min-h-[90px] resize-none"
              placeholder="Add more context, checklist items or notes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="todo">To do</option>
                <option value="inProgress">In progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="e.g. Work, Personal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date || new Date())}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={addHandler}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full md:w-auto disabled:opacity-80"
            >
              {loading ? "Creating..." : "Create task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTodoPage;