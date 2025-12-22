import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { LuPencilLine } from "react-icons/lu";
import { FiCalendar, FiFlag, FiTag, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DetailsPage({ data }) {
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
  const {
    query: { id },
  } = router;

  const priorityColors = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-green-100 text-green-600",
  };

  const statusLabel = {
    todo: "To do",
    inProgress: "In progress",
    review: "Review",
    done: "Done",
  };

  const editHandler = async () => {
    if (!title || !status) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/edit", {
        title,
        description,
        status,
        id,
        priority,
        category,
        dueDate,
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
      const res = await axios.delete("/api/todos", {
        data: { id },
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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {isEditing ? "Edit task" : "Task details"}
            </h2>
            <p className="text-sm text-gray-500">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <LuPencilLine size={14} /> Edit
              </button>
            )}
            <button
              type="button"
              onClick={deleteHandler}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {data.title}
              </h3>
              {data.description && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {data.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {statusLabel[data.status] || data.status}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  priorityColors[data.priority] || priorityColors.medium
                }`}
              >
                <FiFlag /> {data.priority || "medium"}
              </span>
              {data.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  <FiTag />
                  {data.category}
                </span>
              )}
              {data.dueDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  <FiCalendar />
                  {new Date(data.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
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

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editHandler}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-80"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailsPage;