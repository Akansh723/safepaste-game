'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import avatar from '../../data';
import { parapraghData } from './constant';

const DataEntryPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentParagraph, setCurrentParagraph] = useState("");
    const [userName, setUserName] = useState('');
    const [count, setCount] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const dataEntryBoxRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const name = sessionStorage.getItem('name') || '';
        const avId = sessionStorage.getItem('avatar');
        const av = avatar.find((a) => a.id === avId);
        setUserName(name);
        setAvatarUrl(av?.url || '');
    }, []);

    const handleConfirm = async () => {
        const userId = typeof window !== 'undefined' ? sessionStorage.getItem('id') : null;
        try {
            const res = await fetch(`/api/submit/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correct_count: count,
                }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update user");
            }
            setShowModal(false);
        } catch (err) {
            setShowModal(false);
            console.error("❌ Update failed:", err);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleCheckParagraph = async (e) => {
        const userId = typeof window !== 'undefined' ? sessionStorage.getItem('id') : null;
        const redactedText = currentParagraph;
        try {
            const res = await fetch("/api/checkScore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    redactedText,
                    sensitiveWords: parapraghData.sensitiveData,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Scoring failed");
            }

            setCount(result.found);

        } catch (err) {
            setCount(0)
        }
    };

    const handleCopy = async () => {
        try {
            const textToCopy = document.getElementById('text-data-pg').textContent;
            await navigator.clipboard.writeText(textToCopy || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("❌ Failed to copy:", error);
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.auroraContainer}></div>

            <div className={styles.profile}>
                <p>{userName}</p>
                {avatarUrl && <img width={45} src={avatarUrl} alt="User Avatar" />}
            </div>

            <main className={styles.dataCard}>
                <h1>Mission Briefing</h1>

                <div className={styles.contentArea}>
                    <button onClick={handleCopy} className={styles.copyButton}>
                        {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>
                    <div id="text-data-pg" dangerouslySetInnerHTML={{ __html: parapraghData.text }}></div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="data-entry-box">Copy above paragraph and paste it below</label>
                    <div ref={dataEntryBoxRef} className={styles.dataEntryBox} id="data-entry-box">
                        <textarea
                            className={styles.textarea}
                            value={currentParagraph}
                            id="textArea"
                            onChange={(e) => setCurrentParagraph(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleCheckParagraph}
                        className={styles.checkButton}
                        disabled={!currentParagraph}
                    >
                        Check Score
                    </button>

                    {!!count && <p>{`You have identified ${count} sensitive data`}</p>}
                </div>

                <span className={styles.note}>Note: After clicking below button, your response will be locked and you won’t be able to make any further changes.</span>

                <button
                    className={styles.submitButton}
                    onClick={() => setShowModal(true)}
                >
                    Lock scores
                </button>
            </main>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Final Submission</h2>
                        <p>
                            Once you submit, your response will be locked and you won’t be able to make any further changes.
                            Are you sure you want to proceed?
                        </p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirm} className={styles.confirmButton}>Yes, Submit</button>
                            <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataEntryPage;
