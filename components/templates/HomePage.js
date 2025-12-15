import { useEffect, useState } from "react";
import TodoCard from "../modules/TodoCard";
import TodoForm from "../modules/TodoForm";
import FilterBar from "../modules/FilterBar";
import { FiPlus } from "react-icons/fi";

function HomePage() {
    const [todos, setTodos] = useState({ todo: [], inProgress: [], review: [], done: [] });
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState({ priority: 'all' });

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

    const filterTodos = (list) => {
        if (!list) return [];
        return list.filter(item => {
            if (filter.priority !== 'all' && item.priority !== filter.priority) return false;
            return true;
        });
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Manage your tasks efficiently</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all"
                >
                    <FiPlus size={20} /> Add Task
                </button>
            </div>

            <FilterBar filter={filter} setFilter={setFilter} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
                <div className="min-w-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">To Do</h3>
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{filterTodos(todos.todo).length}</span>
                    </div>
                    <div className="space-y-4">
                        {filterTodos(todos.todo).map(todo => (
                            <TodoCard key={todo._id} todo={todo} next="inProgress" fetchTodos={fetchTodos} />
                        ))}
                    </div>
                </div>

                <div className="min-w-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">In Progress</h3>
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">{filterTodos(todos.inProgress).length}</span>
                    </div>
                    <div className="space-y-4">
                        {filterTodos(todos.inProgress).map(todo => (
                            <TodoCard key={todo._id} todo={todo} next="review" back="todo" fetchTodos={fetchTodos} />
                        ))}
                    </div>
                </div>

                <div className="min-w-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Review</h3>
                        <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-bold">{filterTodos(todos.review).length}</span>
                    </div>
                    <div className="space-y-4">
                        {filterTodos(todos.review).map(todo => (
                            <TodoCard key={todo._id} todo={todo} next="done" back="inProgress" fetchTodos={fetchTodos} />
                        ))}
                    </div>
                </div>

                <div className="min-w-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Done</h3>
                        <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">{filterTodos(todos.done).length}</span>
                    </div>
                    <div className="space-y-4">
                        {filterTodos(todos.done).map(todo => (
                            <TodoCard key={todo._id} todo={todo} back="review" fetchTodos={fetchTodos} />
                        ))}
                    </div>
                </div>
            </div>

            {showForm && <TodoForm fetchTodos={fetchTodos} setShowForm={setShowForm} />}
        </div>
    );
}

export default HomePage;