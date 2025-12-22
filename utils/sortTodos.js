function sortTodos(todos = []) {
  const sortedData = {
    todo: [],
    inProgress: [],
    review: [],
    done: []
  };

  todos.forEach(todo => {
    const bucket = sortedData[todo.status] || [];
    bucket.push(todo);
    sortedData[todo.status] = bucket;
  });

  return sortedData;
}

export { sortTodos };
