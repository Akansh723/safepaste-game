// app/api/users/find/route.ts
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");

    if (!pin) {
      return NextResponse.json(
        { error: "Pin is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("safepaste");

    const users = await db
      .collection("users")
      .find({ pin }) // filter by pin
      .toArray();

    return NextResponse.json(
      { users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
