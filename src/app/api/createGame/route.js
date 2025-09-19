import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
    try {
        const { gamePin, securityPin } = await req.json();

        if (!gamePin || !securityPin || securityPin.length !== 4) {
            return NextResponse.json({ error: 'Invalid Game PIN or 4-digit Security PIN' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('safepaste');

        const gameData = {
            gamePin,
            securityPin,
            status: 'created',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('games').insertOne(gameData);

        return NextResponse.json({
            message: 'Game created successfully',
            game: {
                ...gameData,
                gameId: result.insertedId,
            },
        });
    } catch (err) {
        console.error('❌ Error in createGame API:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
