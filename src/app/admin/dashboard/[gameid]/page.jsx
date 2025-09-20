"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useParams } from 'next/navigation';
import moment from 'moment';

const TIMER_DURATION = 10 * 60; // 10 minutes
const POLL_INTERVAL = 5000;

const DashboardPage = () => {
    const params = useParams();
    const gameId = params?.gameid;
    const [game, setGame] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchGame = async () => {
        try {
            const res = await fetch(`/api/getGame?gameId=${gameId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setGame(data.game);
        } catch (err) {
            setError(err.message || 'Failed to fetch game');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/getUserData?pin=${game?.gamePin}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const sorted = data.users.sort((a, b) => {
                const aScore = a.correct_count ?? -1;
                const bScore = b.correct_count ?? -1;

                // Sort by score descending
                if (bScore !== aScore) {
                    return bScore - aScore;
                }

                // If same score, sort by submission time ascending (earlier first)
                const aTime = new Date(a.submittedAt ?? Infinity);
                const bTime = new Date(b.submittedAt ?? Infinity);
                return aTime - bTime;
            });
            setUsers(sorted);
        } catch (err) {
            console.error("Failed fetching users:", err);
        }
    };

    const handleStartGame = async () => {
        try {
            const res = await fetch('/api/startGame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setGame(prev => ({ ...prev, status: 'started' }));

            const storageKey = `game_start_time_${gameId}`;
            localStorage.setItem(storageKey, Date.now().toString());
        } catch (err) {
            setError(err.message || 'Failed to start game');
        }
    };

    // Initial game fetch
    useEffect(() => {
        if (gameId) fetchGame();
    }, [gameId]);

    // Persistent timer & game completion trigger
    useEffect(() => {
        if (!game || game.status !== 'started') return;

        const storageKey = `game_start_time_${gameId}`;
        let startTime = localStorage.getItem(storageKey);

        if (!startTime) {
            startTime = Date.now().toString();
            localStorage.setItem(storageKey, startTime);
        }

        const calculateTimeLeft = () => {
            const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
            return Math.max(TIMER_DURATION - elapsed, 0);
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);

                // End the game automatically
                fetch('/api/endGame', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameId }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setGame((prev) => ({ ...prev, status: 'completed' }));
                        } else {
                            console.error("Failed to complete game:", data.error);
                        }
                    })
                    .catch((err) => console.error("End game API error:", err));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [game]);

    // Poll user results if game is started
    useEffect(() => {
        if (!game || game.status !== 'started') return;

        fetchUsers(); // initial fetch

        const interval = setInterval(() => {
            fetchUsers();
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [game]);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.heading}>🕹️ Game Admin Dashboard</h1>

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : game ? (
                    <>
                        <p className={styles.label}>Game PIN: {game.gamePin}</p>

                        <p className={styles.status}>
                            Current Status: <strong>{game.status}</strong>
                        </p>

                        {game.status === 'created' && (
                            <button
                                className={styles.startButton}
                                onClick={handleStartGame}
                            >
                                Start Game
                            </button>
                        )}

                        {game.status === 'started' && (
                            <>
                                <p className={styles.timer}>
                                    ⏳ Time Left: {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
                                </p>

                                <h3 className={styles.resultsTitle}>Live Statistics</h3>
                                <table className={styles.resultsTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Correct</th>
                                            <th>Submitted At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, i) => (
                                            <tr key={i}>
                                                <td>{game.status === "completed" ? user.name: "****"}</td>
                                                <td>{user.correct_count ?? '-'}</td>
                                                <td>{user.submittedAt ? moment(user.submittedAt).format("hh:mm:ss A") : "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {game.status === 'completed' && (
                            <>
                                <p className={styles.completedMsg}>🎉 Game Over</p>
                                <h3 className={styles.resultsTitle}>Final Statistics</h3>
                                <table className={styles.resultsTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Correct</th>
                                            <th>Submitted At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, i) => (
                                            <tr key={i}>
                                                <td>{user.name}</td>
                                                <td>{user.correct_count ?? '-'}</td>
                                                <td>{moment(user.submittedAt).format("hh:mm:ss")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </>
                ) : (
                    <p className={styles.error}>Game not found.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
