import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from 'react-icons/fi';

function TodoForm({ fetchTodos, setShowForm }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("General");
    const [dueDate, setDueDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const addHandler = async () => {
        if (!title || !status) return;
        setLoading(true);
        const res = await fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify({ title, status, description, priority, category, dueDate }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        setLoading(false);
        if (data.status === "Success") {
            setTitle("");
            setDescription("");
            setStatus("todo");
            setPriority("medium");
            setCategory("General");
            setDueDate(new Date());
            fetchTodos();
            setShowForm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button 
                    onClick={() => setShowForm(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FiX size={24} />
                </button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select 
                                value={priority} 
                                onChange={e => setPriority(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input 
                                type="text" 
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Work"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <DatePicker 
                            selected={dueDate} 
                            onChange={(date) => setDueDate(date)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={addHandler} 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
                        >
                            {loading ? "Adding..." : "Create Task"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoForm;
