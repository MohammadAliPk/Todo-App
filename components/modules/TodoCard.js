import { useState } from 'react';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';

function TodoCard({ todo, next, back, fetchTodos }) {
    const [loading, setLoading] = useState(false);

    const priorityColors = {
        high: 'bg-red-100 text-red-600',
        medium: 'bg-yellow-100 text-yellow-600',
        low: 'bg-green-100 text-green-600',
    };

    const changeStatus = async (status) => {
        setLoading(true);
        const res = await fetch('/api/todos', {
            method: 'PATCH',
            body: JSON.stringify({ id: todo._id, status }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setLoading(false);
        if (data.status === 'Success') fetchTodos();
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-4">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg text-gray-800">{todo.title}</h4>
                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${priorityColors[todo.priority] || priorityColors.medium}`}>
                    <FiFlag /> {todo.priority || 'medium'}
                </div>
            </div>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{todo.description}</p>
            
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                {todo.dueDate && (
                    <div className="flex items-center gap-1">
                        <FiCalendar /> {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                    </div>
                )}
                {todo.category && (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <FiTag /> {todo.category}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                    {back && (
                        <button 
                            onClick={() => changeStatus(back)} 
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Back
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {next && (
                        <button 
                            onClick={() => changeStatus(next)} 
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TodoCard;
