"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState("");
  const { isSignedIn } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && isSignedIn) {
      onAddTodo(text);
      setText("");
    }
  };

  if (!isSignedIn) {
    return <p className="text-center">Sign in to add tasks</p>;
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your task"
        className="todo-input"
      />
      <button type="submit" className="add-button">Add Task</button>
    </form>
  );
};

export default TodoForm;
