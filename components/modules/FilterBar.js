"use client";

import { motion } from "framer-motion";
import { FiFilter, FiSearch } from "react-icons/fi";

function FilterBar({ filter, setFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="glass-panel mb-8 flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center"
    >
      <div className="flex items-center gap-2 text-tide">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-tide/10">
          <FiFilter />
        </span>
        <span className="text-sm font-semibold text-ink-soft">Filters</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="relative min-w-[180px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-mute">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            value={filter.search}
            onChange={e =>
              setFilter({ ...filter, search: e.target.value || "" })
            }
            placeholder="Search tasks by title or description"
            className="field-input pl-9"
          />
        </div>

        <select
          value={filter.priority}
          onChange={e => setFilter({ ...filter, priority: e.target.value })}
          className="field-input md:w-48"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </motion.div>
  );
}

export default FilterBar;
