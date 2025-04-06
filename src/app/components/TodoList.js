const TodoList = ({ tasks, onDeleteTodo, onToggleComplete }) => {
  const handleDelete = (id) => {
    onDeleteTodo(id);
  };

  const handleToggleComplete = (id) => {
    onToggleComplete(id);
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task._id)}
          />
          <span className={task.completed ? "completed" : ""}>{task.text}</span>
          <button onClick={() => handleDelete(task._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
