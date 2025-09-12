"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import avatar from '../data';


const Login = () => {
    const [codename, setCodename] = useState('');
    const [pin, setPin] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('emoji');
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch("/api/addUserData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: codename, pin }),
            });
            const result = await res.json();
            sessionStorage.setItem("id", result?.id)
            sessionStorage.setItem("name", codename)
            sessionStorage.setItem("avatar", selectedAvatar)
            router.push("/game")
        } catch (err) {
            console.error("Error login", err)
        }
    };
    return (
        <div className={styles.body}>
            <div className={styles.auroraContainer}>
                <div className={`${styles.auroraBand} ${styles.aurora1}`}></div>
                <div className={`${styles.auroraBand} ${styles.aurora2}`}></div>
                <div className={`${styles.auroraBand} ${styles.aurora3}`}></div>
            </div>
            <main className={styles.loginCard}>
                <h1 className={styles.h1}>Welcome Aboard</h1>
                <p className={styles.subtitle}>Enter your credentials to begin</p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="codename" className={styles.label}>Your Name</label>
                        <input
                            type="text"
                            id="codename"
                            name="codename"
                            className={styles.inputField}
                            required
                            autoComplete="off"
                            value={codename}
                            onChange={(e) => setCodename(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="pin" className={styles.label}>Secret Code (4 Digits)</label>
                        <input
                            type="password"
                            id="pin"
                            name="pin"
                            className={styles.inputField}
                            required
                            maxLength="4"
                            pattern="\d{4}"
                            title="Please enter a 4-digit code."
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                    </div>
                    <div className={styles.avatarChooser}>
                        <h2>Select Your Profile Icon</h2>
                        <div className={styles.avatarGrid}>
                            {avatar.map(av => {
                                return (<label className={styles.avatarOption} key={av.id}>
                                    <input
                                        type="radio"
                                        name="avatar"
                                        value={av.id}
                                        checked={selectedAvatar === av.id}
                                        onChange={() => setSelectedAvatar(av.id)}
                                    />
                                    <img src={av.url} alt={av.alt} />
                                </label>)
                            })}
                        </div>
                    </div>
                    <button onClick={handleSubmit} className={styles.startButton} disabled={codename === "" || pin === ""}>Engage</button>
                </form>
            </main>
        </div>
    );
};

export default Login;