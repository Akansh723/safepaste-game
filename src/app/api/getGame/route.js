import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
        return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("safepaste");

        const game = await db.collection("games").findOne({ gamePin: gameId });
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        return NextResponse.json({ game });
    } catch (err) {
        console.error('Error in getGame API:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
