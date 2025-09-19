import { NextResponse } from 'next/server';
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
    try {
        const { sensitiveWords, redactedText, id, gamepin } = await req.json();
        const gamePin = gamepin;

        if (!sensitiveWords || !redactedText || !id || !gamepin) {
            return NextResponse.json(
                { error: "Missing one or more required fields: sensitiveWords, redactedText, id, gamepin" },
                { status: 400 }
            );
        }

        // Normalize function
        const normalize = (text) =>
            text
                .replace(/<[^>]*>/g, '')   // remove HTML tags
                .replace(/\s+/g, ' ')      // collapse whitespace
                .replace(/\n/g, ' ')       // remove newlines
                .trim();

        const text = normalize(redactedText);

        let found = 0;
        let missed = 0;

        sensitiveWords.forEach((word) => {
            if (!text.includes(word)) {
                found++;
            } else {
                missed++;
            }
        });

        const client = await clientPromise;
        const db = client.db("safepaste");

        // 🔒 Check game status
        const game = await db.collection("games").findOne({ gamePin });

        if (!game) {
            return NextResponse.json(
                { error: "Invalid game PIN" },
                { status: 404 }
            );
        }

        if (game.status === 'created') {
            return NextResponse.json(
                { error: "Game is not started yet. Please wait for the host to start." },
                { status: 403 }
            );
        }

        if (game.status === 'completed') {
            return NextResponse.json(
                { error: "Game is already completed. Submissions are closed." },
                { status: 403 }
            );
        }

        // ✅ Update user score if game is started
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    correct_count: found,
                    submittedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            found,
            missed,
        });

    } catch (err) {
        console.error('❌ Error in /api/checkScore:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
