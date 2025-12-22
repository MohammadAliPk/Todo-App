import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { sortTodos } from "@/utils/sortTodos";
import { authOptions } from "@/utils/authOptions";

export async function POST(req) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "Failed", message: "Error connecting to database" },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { status: "Failed", message: "Please Login" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json(
      { status: "Failed", message: "User not found" },
      { status: 404 }
    );
  }

  const {
    title,
    status,
    description,
    priority,
    dueDate,
    category
  } = await req.json();

  if (!title || !status) {
    return NextResponse.json(
      { status: "Failed", message: "Please enter valid data" },
      { status: 422 }
    );
  }

  user.todos.push({
    title,
    status,
    description,
    priority: priority || "medium",
    dueDate: dueDate || null,
    category: category || "General"
  });
  await user.save();

  return NextResponse.json({
    status: "Success",
    message: "Todo List successfully updated"
  });
}

export async function GET() {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "Failed", message: "Error connecting to database" },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { status: "Failed", message: "Please Login" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json(
      { status: "Failed", message: "User not found" },
      { status: 404 }
    );
  }

  const sortedData = sortTodos(user.todos);

  return NextResponse.json({
    status: "Success",
    data: { todos: sortedData }
  });
}

export async function PATCH(req) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "Failed", message: "Error connecting to database" },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { status: "Failed", message: "Please Login" },
      { status: 401 }
    );
  }

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json(
      { status: "Failed", message: "Please enter valid data" },
      { status: 422 }
    );
  }

  await User.updateOne(
    { "todos._id": id },
    { $set: { "todos.$.status": status } }
  );

  return NextResponse.json({
    status: "Success",
    message: "Todo List successfully updated"
  });
}

export async function DELETE(req) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "Failed", message: "Error connecting to database" },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { status: "Failed", message: "Please Login" },
      { status: 401 }
    );
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { status: "Failed", message: "Todo id is required" },
      { status: 422 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json(
      { status: "Failed", message: "User not found" },
      { status: 404 }
    );
  }

  await User.updateOne({ _id: user._id }, { $pull: { todos: { _id: id } } });

  return NextResponse.json({
    status: "Success",
    message: "Todo successfully deleted"
  });
}
