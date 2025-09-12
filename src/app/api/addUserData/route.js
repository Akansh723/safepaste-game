import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

// POST /api/addUserData
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, pin } = body;

    const client = await clientPromise;
    const db = client.db("safepaste");

    const result = await db.collection("users").insertOne({
      name,
      pin,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: "Failed to add user" },
      { status: 500 }
    );
  }
}
