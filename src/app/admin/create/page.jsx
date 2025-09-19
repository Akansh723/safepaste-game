'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Optional styling

const StartGamePage = () => {
    const [gamePin, setGamePin] = useState('');
    const [securityPin, setSecurityPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!gamePin || !securityPin || securityPin.length !== 4 || !/^\d{4}$/.test(securityPin)) {
            setError('Please enter a valid Game PIN and a 4-digit numeric Security PIN.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gamePin, securityPin }),
            });

            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                setError(data.error || 'Failed to create game.');
            } else {
                router.push(`/admin/dashboard/${data.game.gamePin}`);
            }
        } catch (err) {
            console.error('Game creation failed:', err);
            setError('Something went wrong. Try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.title}>🎮 Start a New Game</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>Game PIN</label>
                    <input
                        type="text"
                        value={gamePin}
                        onChange={(e) => setGamePin(e.target.value)}
                        className={styles.input}
                        placeholder="Enter Game PIN"
                        required
                    />

                    <label className={styles.label}>4-digit Security PIN</label>
                    <input
                        type="password"
                        value={securityPin}
                        onChange={(e) => setSecurityPin(e.target.value)}
                        className={styles.input}
                        placeholder="1234"
                        maxLength={4}
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Start Game'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StartGamePage;
