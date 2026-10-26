import { sortTodos } from "@/utils/sortTodos";
import { GUEST_COOKIE, GUEST_TODOS_KEY } from "@/utils/guestConstants";

export { GUEST_COOKIE, GUEST_TODOS_KEY };

const demoTodos = () => [
  {
    _id: `g_${Date.now()}_1`,
    title: "Explore Flowboard",
    status: "todo",
    description: "Look around the Kanban columns and filters.",
    priority: "medium",
    category: "Demo",
    dueDate: new Date().toISOString()
  },
  {
    _id: `g_${Date.now()}_2`,
    title: "Drag me to In Progress",
    status: "todo",
    description: "Drop this card onto another column.",
    priority: "high",
    category: "Demo",
    dueDate: new Date().toISOString()
  },
  {
    _id: `g_${Date.now()}_3`,
    title: "Add your first real task",
    status: "inProgress",
    description: "Try the Add Task button.",
    priority: "low",
    category: "Demo",
    dueDate: new Date().toISOString()
  }
];

export function enableGuestMode() {
  if (typeof document === "undefined") return;
  document.cookie = `${GUEST_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  if (!localStorage.getItem(GUEST_TODOS_KEY)) {
    localStorage.setItem(GUEST_TODOS_KEY, JSON.stringify(demoTodos()));
  }
}

export function clearGuestMode() {
  if (typeof document === "undefined") return;
  document.cookie = `${GUEST_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(GUEST_TODOS_KEY);
  } catch {
    /* ignore */
  }
}

export function isGuestClient() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some(part => part.trim() === `${GUEST_COOKIE}=1`);
}

export function loadGuestTodosFlat() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_TODOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestTodosFlat(todos) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_TODOS_KEY, JSON.stringify(todos));
}

export function getSortedGuestTodos() {
  return sortTodos(loadGuestTodosFlat());
}

export function addGuestTodo(todo) {
  const todos = loadGuestTodosFlat();
  const item = {
    _id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: todo.title,
    status: todo.status || "todo",
    description: todo.description || "",
    priority: todo.priority || "medium",
    category: todo.category || "General",
    dueDate: todo.dueDate
      ? new Date(todo.dueDate).toISOString()
      : new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  todos.push(item);
  saveGuestTodosFlat(todos);
  return item;
}

export function updateGuestTodoStatus(id, status) {
  const todos = loadGuestTodosFlat().map(t =>
    String(t._id) === String(id) ? { ...t, status } : t
  );
  saveGuestTodosFlat(todos);
  return todos;
}

export function updateGuestTodo(id, patch) {
  const todos = loadGuestTodosFlat().map(t => {
    if (String(t._id) !== String(id)) return t;
    return {
      ...t,
      ...patch,
      dueDate: patch.dueDate
        ? new Date(patch.dueDate).toISOString()
        : t.dueDate
    };
  });
  saveGuestTodosFlat(todos);
  return todos.find(t => String(t._id) === String(id)) || null;
}

export function deleteGuestTodo(id) {
  const todos = loadGuestTodosFlat().filter(t => String(t._id) !== String(id));
  saveGuestTodosFlat(todos);
  return todos;
}

export function getGuestTodoById(id) {
  return loadGuestTodosFlat().find(t => String(t._id) === String(id)) || null;
}
