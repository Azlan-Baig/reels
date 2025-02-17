import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/User";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  try {
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
   const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User Already exists" },
        { status: 400 }
      );
    }


    await User.create({email,password});
    return NextResponse.json(
        { message: "User is successfully registered" },
        { status: 201 }
      );
  } catch (error) {
    return NextResponse.json(
        { error: "Failed to register" },
        { status: 400 }
      );
  }
}
