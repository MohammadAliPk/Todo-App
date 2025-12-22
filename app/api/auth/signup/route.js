import { NextResponse } from "next/server";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";

export async function POST(req) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "Failed", message: "Error connecting to database" },
      { status: 500 }
    );
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { status: "Failed", message: "Please enter valid data" },
      { status: 422 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      {
        status: "Failed",
        message: "User already exists with this email"
      },
      { status: 422 }
    );
  }

  const hashedPassword = await hashPassword(password);
  await User.create({ email, password: hashedPassword });

  return NextResponse.json(
    { status: "Success", message: "User created successfully" },
    { status: 201 }
  );
}
