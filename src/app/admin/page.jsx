"use client";

import { useState } from 'react';
import styles from './page.module.css'; 
import moment from 'moment';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (event) => {
        event.preventDefault();
        setError('');
        setSearchResults([]);
        setIsLoading(true);

        if (!searchTerm) {
            setError('Please enter a PIN to search.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/getUserData?pin=${searchTerm}`);
            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }
            const data = await res.json();
            
            setSearchResults(data.users.sort((a, b) => b.correct_count - a.correct_count));
        } catch (err) {
            console.error("Error searching:", err);
            setError('Failed to fetch search results. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.auroraContainer}>
                <div className={`${styles.auroraBand} ${styles.aurora1}`}></div>
                <div className={`${styles.auroraBand} ${styles.aurora2}`}></div>
                <div className={`${styles.auroraBand} ${styles.aurora3}`}></div>
            </div>

            <main className={styles.searchCard}>
                <h1 className={styles.h1}>Locate Records</h1>
                <p className={styles.subtitle}>Enter a Secret Code to retrieve data</p>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="searchPin" className={styles.label}>Secret Code (PIN)</label>
                        <input
                            type="text"
                            id="searchPin"
                            name="searchPin"
                            className={styles.inputField}
                            placeholder="Enter 4-digit PIN"
                            maxLength="4"
                            pattern="\d{4}"
                            title="Please enter a 4-digit PIN."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.startButton} disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search Records'}
                    </button>
                </form>

                {error && <p className={styles.errorMessage}>{error}</p>}

                {searchResults.length > 0 && (
                    <div className={styles.resultsContainer}>
                        <h2 className={styles.resultsTitle}>Search Results</h2>
                        <table className={styles.resultsTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Correct count</th>
                                    <th>Submitted at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((result, index) => (
                                    <tr key={index}>
                                        <td>{result.name}</td>
                                        <td>{result?.correct_count ?? "-"}</td>
                                        {console.log(typeof result.submittedAt)}
                                        <td>{moment(result?.submittedAt).format("hh:mm:ss")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && !error && searchResults.length === 0 && searchTerm && (
                    <p className={styles.noResultsMessage}>No records found for this PIN.</p>
                )}
            </main>
        </div>
    );
};

export default SearchPage;