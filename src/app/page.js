"use client"; // This makes it a client component

import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const Page = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component is mounted
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");

        if (response.ok) {
          const data = await response.json();
          setTasks(data); // Set tasks from the response
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTodo = async (newTaskText) => {
    try {
      // Send the new task to the backend
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTaskText }),
      });

      if (response.ok) {
        const newTask = await response.json();
        // Update the tasks state with the new task
        setTasks((prevTasks) => [...prevTasks, newTask]);

        // Show success notification with Toastify
        Toastify({
          text: "Task added successfully!",
          backgroundColor: "#4CAF50", // Green color for success
          position: "center", // Center the toast
          duration: 3000,
          close: true,
        }).showToast();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted task from the state
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

        // Show success notification with Toastify
        Toastify({
          text: "Task deleted successfully!",
          backgroundColor: "red", // Red color for delete
          position: "center", // Center the toast
          duration: 3000,
          close: true,
        }).showToast();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskFromDb = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? updatedTaskFromDb : task
          )
        );

        // Show success notification with Toastify
        Toastify({
          text: "Task status updated!",
          backgroundColor: "blue", // Blue color for update
          position: "center", // Center the toast
          duration: 3000,
          close: true,
        }).showToast();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h1>MY TODO APP</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        tasks={tasks}
        onDeleteTodo={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default Page;
