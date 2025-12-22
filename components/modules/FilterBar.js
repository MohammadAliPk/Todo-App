"use client";

import { FiFilter, FiSearch } from "react-icons/fi";

function FilterBar({ filter, setFilter }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500">
        <FiFilter />
        <span className="font-medium text-sm">Filters</span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 min-w-[180px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            value={filter.search}
            onChange={e =>
              setFilter({ ...filter, search: e.target.value || "" })}
            placeholder="Search tasks by title or description"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
          />
        </div>

        <select
          value={filter.priority}
          onChange={e => setFilter({ ...filter, priority: e.target.value })}
          className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none md:w-48"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
