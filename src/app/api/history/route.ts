import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch saved history for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    const history = await prisma.content.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ history }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch History API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved content history" },
      { status: 500 }
    );
  }
}

// POST: Save generated content to database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, prompt, output, contentType, topic, tone } = body;

    if (!userId || !prompt || !output || !contentType || !topic || !tone) {
      return NextResponse.json(
        { error: "Missing required fields to save content." },
        { status: 400 }
      );
    }

    // Verify user exists before saving (data integrity)
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Associated user account was not found." },
        { status: 404 }
      );
    }

    const savedContent = await prisma.content.create({
      data: {
        userId,
        prompt,
        output,
        contentType,
        topic,
        tone,
      },
    });

    return NextResponse.json({ content: savedContent }, { status: 201 });
  } catch (error: any) {
    console.error("Save Content API Error:", error);
    return NextResponse.json(
      { error: "Failed to save content to history database" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a saved history record
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    // Attempt to delete
    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Record deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Content API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete history record or item was not found" },
      { status: 500 }
    );
  }
}
