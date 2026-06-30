import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Try to find the user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Validate password (plain text checking is fine for dummy auth)
      if (user.password !== password) {
        return NextResponse.json(
          { error: "Invalid password credentials" },
          { status: 401 }
        );
      }
    } else {
      // Register new user on the fly
      user = await prisma.user.create({
        data: {
          email,
          password,
          name: name || email.split("@")[0],
        },
      });
    }

    // Return user details (excluding password)
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
