import { NextResponse } from 'next/server';
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
    try {
        const { sensitiveWords, redactedText, id } = await req.json();

        if (!sensitiveWords || !redactedText) {
            return NextResponse.json(
                { error: "Missing one or more required fields: sensitiveWords, redactedText" },
                { status: 400 }
            );
        }

        const normalize = (text) =>
            text
                .replace(/<[^>]*>/g, '')   // remove HTML tags like <p>, <br>, etc.
                .replace(/\s+/g, ' ')      // collapse multiple spaces, tabs, newlines into single space
                .replace(/\n/g, ' ')       // remove newlines explicitly (if any remain)
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
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
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
