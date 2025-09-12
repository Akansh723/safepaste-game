'use client';

import React, { useState, useRef } from 'react';
import styles from './page.module.css';
import avatar from '../../data';
import { parapraghData } from './constant';

const DataEntryPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentParagraph, setCurrentParagraph] = useState("");
    const dataEntryBoxRef = useRef(null);

    const handleConfirm = async () => {
        const { sensitiveData } = parapraghData
        var count = 0
        sensitiveData.forEach((sensitiveString) => !currentParagraph.includes(sensitiveString) && count++)
        const userId = sessionStorage.getItem("id")
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
            // return data;
        } catch (err) {
            setShowModal(false);
            console.error("❌ Update failed:", err);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleCheckParagraph = (e) => {
        // TODO
        e.preventDefault()
        setCurrentParagraph("api_key")
    };

    return (
        <div className={styles.bodyContainer}>
            <div id="aurora-container" className={styles.auroraContainer}>
                {/* <div className={`${styles.auroraBand} ${styles.aurora1}`} id="aurora-1"></div> */}
                {/* <div className={`${styles.auroraBand} ${styles.aurora2}`} id="aurora-2"></div> */}
                {/* <div className={`${styles.auroraBand} ${styles.aurora3}`} id="aurora-3"></div> */}
            </div>
            <div className={styles.profile}>
                <p>{sessionStorage.getItem("name")}</p>
                <img width={45} src={avatar.find(av => sessionStorage.getItem("avatar") === av.id)?.url} alt="User Avatar" />
            </div>
            <main className={styles.dataCard}>
                <h1>Mission Briefing</h1>
                <div className={styles.contentArea}>
                    <div dangerouslySetInnerHTML={{ __html: parapraghData.text }}></div>
                </div>
                <form id="data-entry-form" className={styles.dataEntryForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="data-entry-box">Your result:</label>
                        <div ref={dataEntryBoxRef} className={styles.dataEntryBox} id="data-entry-box">
                            <p>{currentParagraph}</p>
                        </div>
                        <button type="submit" onClick={handleCheckParagraph} className={styles.checkButton}>Check Current Paragraph</button>
                    </div>
                    <span className={styles.note}>Note: Data can only be transmitted once.</span>
                </form>
                <button type="submit" className={styles.submitButton} onClick={() => setShowModal(true)}>Transmit Data</button>
            </main>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Data Transmission</h2>
                        <p>Are you sure you want to transmit the following data? Please note, you can only transmit the data once.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirm} className={styles.confirmButton}>Confirm</button>
                            <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataEntryPage;