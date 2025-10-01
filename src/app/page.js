"use client"; 

import { useState, useEffect } from "react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const Page = () => {
  const { user, isSignedIn } = useUser(); 
  const [tasks, setTasks] = useState([]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (isSignedIn) {
        try {
          const response = await fetch(`/api/tasks?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Sort tasks by `order` before setting
            const sorted = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setTasks(sorted);
          } else {
            console.error("Failed to fetch tasks");
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };
    fetchTasks();
  }, [isSignedIn, user]);

  // Add Task
  const handleAddTodo = async (newTaskText) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTaskText, userId: user.id }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        Toastify({ text: "Task added successfully!", backgroundColor: "#4CAF50", position: "center", duration: 3000, close: true }).showToast();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete Task
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        Toastify({ text: "Task deleted successfully!", backgroundColor: "red", position: "center", duration: 3000, close: true }).showToast();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle Complete
  const handleToggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskFromDb = await response.json();
        setTasks((prevTasks) => prevTasks.map((task) => task._id === id ? updatedTaskFromDb : task));
        Toastify({ text: "Task status updated!", backgroundColor: "blue", position: "center", duration: 3000, close: true }).showToast();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Reorder tasks
  // inside Page component
const handleReorder = (newTasks) => setTasks(newTasks);


  return (
    <div>
      <h1>MY TODO APP</h1>
      {!isSignedIn ? (
        <div className="auth-container">
          <p className="auth-text">Please sign in to manage your tasks.</p>
          <div className="auth-buttons">
            <SignInButton mode="modal"><button className="auth-btn sign-in">Sign In</button></SignInButton>
            <SignUpButton mode="modal"><button className="auth-btn sign-up">Sign Up</button></SignUpButton>
          </div>
        </div>
      ) : (
        <>
          <UserButton afterSignOutUrl="/" />
          <TodoForm onAddTodo={handleAddTodo} />
          <TodoList
            tasks={tasks}
            onDeleteTodo={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
            onReorder={handleReorder}   // pass down reorder handler
          />
        </>
      )}
    </div>
  );
};

export default Page;
