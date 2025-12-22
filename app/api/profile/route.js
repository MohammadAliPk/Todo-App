import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { authOptions } from "@/utils/authOptions";
import { hashPassword } from "@/utils/auth";

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
      { status: "Failed", message: "Please login first and try again" },
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

  return NextResponse.json({
    status: "Success",
    data: { name: user.name, lastName: user.lastName, email: user.email }
  });
}

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
      { status: "Failed", message: "Please login first and try again" },
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

  const { name, lastName, password } = await req.json();

  if (!name && !lastName && !password) {
    return NextResponse.json(
      { status: "Failed", message: "Please provide data to update" },
      { status: 422 }
    );
  }

  if (name) user.name = name;
  if (lastName) user.lastName = lastName;
  if (password) {
    user.password = await hashPassword(password);
  }

  await user.save();

  return NextResponse.json({
    status: "Success",
    message: "Profile updated successfully"
  });
}
