"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const TodoList = ({ tasks, onDeleteTodo, onToggleComplete, onReorder }) => {
  const { isSignedIn } = useUser();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (!isSignedIn) return <p className="text-center">Sign in to view your tasks</p>;

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (index) => {
    if (index !== draggedIndex) setDragOverIndex(index);
  };
  const handleDrop = () => {
    if (draggedIndex === null || dragOverIndex === null) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(dragOverIndex, 0, movedTask);

    setDraggedIndex(null);
    setDragOverIndex(null);
    onReorder(newTasks);

    // Update backend order
    newTasks.forEach((task, i) => {
      fetch(`/api/tasks?id=${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: i }),
      });
    });
  };

  // Touch support
  const handleTouchStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;
    const touchY = e.touches[0].clientY;

    // determine which index the touch is over
    const elements = document.querySelectorAll(".task-item");
    elements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (touchY > rect.top && touchY < rect.bottom && idx !== draggedIndex) {
        setDragOverIndex(idx);
      }
    });
  };

  const handleTouchEnd = () => handleDrop();

  return (
    <ul
      className="task-list"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {tasks.map((task, index) => (
        <li
          key={task._id}
          className={`task-item ${dragOverIndex === index ? "drag-over" : ""}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(index)}
          onDrop={handleDrop}
          onTouchStart={(e) => handleTouchStart(e, index)}
        >
          <span className="drag-handle" title="Drag to reorder">☰</span>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id)}
          />
          <span className={task.completed ? "completed" : ""}>{task.text}</span>
          <button onClick={() => onDeleteTodo(task._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
