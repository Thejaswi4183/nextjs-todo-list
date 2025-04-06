import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // Make sure you import ObjectId

// Fetch tasks
export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    const tasks = await collection.find({}).toArray();

    return new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response("Error fetching tasks", { status: 500 });
  }
}

// Add task

export async function POST(request) {
  try {
    // Ensure that the request body is properly parsed
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



// Delete task
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Get the task id from the URL params

  if (!id) {
    return new Response("Task ID is required", { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

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

//Update Task
export async function PUT(request) {
  const { id } = Object.fromEntries(new URL(request.url).searchParams); // Correctly extract the ID from query string
  const updatedTask = await request.json(); // Extract the updated task data

  if (!id || !updatedTask) {
    return new Response("Task ID and update data are required", { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("tasks");

    // Update task using ObjectId
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Find task by ObjectId
      { $set: { completed: updatedTask.completed } } // Update only the completed status
    );

    if (result.matchedCount > 0) {
      // If matched task, return the updated task from the database
      const updatedTaskFromDb = await collection.findOne({ _id: new ObjectId(id) });
      return new Response(JSON.stringify(updatedTaskFromDb), { status: 200 });
    } else {
      return new Response("Task not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response("Error updating task", { status: 500 });
  }
}
