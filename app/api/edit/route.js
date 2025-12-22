import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
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

  const {
    id,
    status,
    title,
    description,
    priority,
    dueDate,
    category
  } = await req.json();

  if (!id || !status || !title) {
    return NextResponse.json(
      { status: "Failed", message: "Please enter valid data" },
      { status: 422 }
    );
  }

  await User.updateOne(
    { "todos._id": id },
    {
      $set: {
        "todos.$.status": status,
        "todos.$.title": title,
        "todos.$.description": description,
        "todos.$.priority": priority,
        "todos.$.dueDate": dueDate,
        "todos.$.category": category
      }
    }
  );

  return NextResponse.json({
    status: "Success",
    message: "Todo successfully updated"
  });
}
