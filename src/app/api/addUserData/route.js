import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// POST /api/addUserData
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, pin } = body;

    if (!name || !pin) {
      return NextResponse.json({ error: "Name and PIN are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("safepaste");

    // 1. Find the game with this pin
    const game = await db.collection("games").findOne({ gamePin: pin });

    if (!game) {
      return NextResponse.json({ error: "Invalid game PIN" }, { status: 404 });
    }

    // 2. Check if game status is 'created'
    if (game.status === "started") {
      return NextResponse.json({ error: "Game has already started. You cannot join now." }, { status: 403 });
    }

    if (game.status === "completed") {
      return NextResponse.json({ error: "Game is already completed. You cannot join." }, { status: 403 });
    }

    // 3. If status is 'created', allow joining
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
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
