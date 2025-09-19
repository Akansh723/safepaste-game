import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
    try {
        const { gameId } = await req.json();
        if (!gameId) {
            return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("safepaste");

        const result = await db.collection("games").updateOne(
            { gamePin: gameId },
            { $set: { status: "completed", updatedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Game not found or already completed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Game completed successfully', success: true });
    } catch (err) {
        console.error('❌ Error in startGame API:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
