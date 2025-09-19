import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PATCH /api/submit/:id?gamepin=123456
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const gamePin = searchParams.get("gamepin");

    const body = await req.json();
    const { correct_count } = body;

    if (!gamePin) {
      return NextResponse.json(
        { error: "Missing gamepin in query params" },
        { status: 400 }
      );
    }

    if (correct_count === undefined || correct_count === null) {
      return NextResponse.json(
        { error: "correct_count is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("safepaste");

    // 🛡️ Validate game status first
    const game = await db.collection("games").findOne({ gamePin });

    if (!game) {
      return NextResponse.json(
        { error: "Invalid game PIN" },
        { status: 404 }
      );
    }

    if (game.status === "created") {
      return NextResponse.json(
        { error: "Game is not started yet" },
        { status: 403 }
      );
    }

    if (game.status === "completed") {
      return NextResponse.json(
        { error: "Game is already completed" },
        { status: 403 }
      );
    }

    // ✅ Proceed with user update
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          correct_count,
          submittedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
