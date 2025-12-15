import { FiFilter } from 'react-icons/fi';

function FilterBar({ filter, setFilter }) {
    return (
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
                <FiFilter />
                <span className="font-medium">Filter:</span>
            </div>
            <select 
                value={filter.priority} 
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="border-none bg-gray-50 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            {/* Add more filters as needed */}
        </div>
    );
}

export default FilterBar;
