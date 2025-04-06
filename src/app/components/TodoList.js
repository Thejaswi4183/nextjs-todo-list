"use client";

import { useUser } from "@clerk/nextjs";

const TodoList = ({ tasks, onDeleteTodo, onToggleComplete }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <p className="text-center">Sign in to view your tasks</p>;
  }

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
