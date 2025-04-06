// src/app/api/tasks/route.js
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // Make sure you import ObjectId
import { getAuth } from "@clerk/nextjs/server";

// Fetch tasks for the authenticated user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Only return tasks for the authenticated user
    const tasks = await collection.find({ userId }).toArray();

    return new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response("Error fetching tasks", { status: 500 });
  }
}

// Add a task for the authenticated user
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { text } = await request.json();
    if (!text) {
      return new Response("Task text is required", { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    const newTask = {
      text,
      completed: false,
      createdAt: new Date(),
      userId, // Associate task with the authenticated user
    };

    const result = await collection.insertOne(newTask);

    // Fetch the newly added task from the database and return it
    const addedTask = await collection.findOne({ _id: result.insertedId });

    return new Response(JSON.stringify(addedTask), { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response("Error adding task", { status: 500 });
  }
}

// Delete a task (only if it belongs to the authenticated user)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Get the task id from the URL params

  if (!id) {
    return new Response("Task ID is required", { status: 400 });
  }

  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Delete only if the task belongs to the authenticated user
    const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 1) {
      return new Response("Task deleted successfully", { status: 200 });
    } else {
      return new Response("Task not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response("Error deleting task", { status: 500 });
  }
}

// Update task (only if it belongs to the authenticated user)
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Extract the task ID from query string
  const updatedTask = await request.json(); // Extract the updated task data

  if (!id || !updatedTask) {
    return new Response("Task ID and update data are required", { status: 400 });
  }

  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Update task only if it belongs to the authenticated user
    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { completed: updatedTask.completed } }
    );

    if (result.matchedCount > 0) {
      // Return the updated task from the database
      const updatedTaskFromDb = await collection.findOne({ _id: new ObjectId(id), userId });
      return new Response(JSON.stringify(updatedTaskFromDb), { status: 200 });
    } else {
      return new Response("Task not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response("Error updating task", { status: 500 });
  }
}
