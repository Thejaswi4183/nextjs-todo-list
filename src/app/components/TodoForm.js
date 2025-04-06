import { useState } from "react";

const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      onAddTodo(text);
      setText(""); // Clear the input field
    }
  };

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
