// src/app/api/tasks/route.js
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";

// Fetch tasks for the authenticated user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Always sort by `order`
    const tasks = await collection.find({ userId }).sort({ order: 1 }).toArray();

    return new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response("Error fetching tasks", { status: 500 });
  }
}

// Add a new task
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { text } = await request.json();
    if (!text) return new Response("Task text is required", { status: 400 });

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Determine the last order number
    const lastTask = await collection.find({ userId }).sort({ order: -1 }).limit(1).toArray();
    const newOrder = lastTask.length ? lastTask[0].order + 1 : 0;

    const newTask = {
      text,
      completed: false,
      createdAt: new Date(),
      userId,
      order: newOrder, // <-- assign order
    };

    const result = await collection.insertOne(newTask);
    const addedTask = await collection.findOne({ _id: result.insertedId });

    return new Response(JSON.stringify(addedTask), { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response("Error adding task", { status: 500 });
  }
}

// Delete a task
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Task ID is required", { status: 400 });

  try {
    const { userId } = getAuth(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    const result = await collection.deleteOne({ _id: new ObjectId(id), userId });
    if (result.deletedCount === 1) return new Response("Task deleted successfully", { status: 200 });

    return new Response("Task not found", { status: 404 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response("Error deleting task", { status: 500 });
  }
}

// Update task (completion or order)
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const updatedData = await request.json();
  if (!id || !updatedData) return new Response("Task ID and update data are required", { status: 400 });

  try {
    const { userId } = getAuth(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Only update the fields provided (completed, order, etc.)
    const updateFields = {};
    if (updatedData.completed !== undefined) updateFields.completed = updatedData.completed;
    if (updatedData.order !== undefined) updateFields.order = updatedData.order;

    await collection.updateOne({ _id: new ObjectId(id), userId }, { $set: updateFields });

    const updatedTask = await collection.findOne({ _id: new ObjectId(id), userId });
    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response("Error updating task", { status: 500 });
  }
}
