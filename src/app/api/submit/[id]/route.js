import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PATCH api/submit/:id
export async function PATCH(req, { params }) {
  try {
    const { id } = params; 
    const body = await req.json();
    const { correct_count } = body;
    if (!correct_count && correct_count !== 0) {
      return NextResponse.json(
        { error: "correct_count is required" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("safepaste");
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
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
