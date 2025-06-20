import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import words from "./Words";
import styles from './knownUnknown.module.css'

const KnownUnknown = ({ selectedTopic }) => {
    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredWords, setFilteredWords] = useState([]);

  // Обновляем filteredWords при смене темы
    useEffect(() => {
    const newFiltered = selectedTopic
        ? words.filter(word =>
            (word.tags.trim() === '' ? 'Без темы' : word.tags) === selectedTopic)
        : words;

    setFilteredWords(newFiltered);
    setCurrentIndex(0);
    setKnownWords([]);
    setUnknownWords([]);
    }, [selectedTopic]);

    const currentWord = filteredWords[currentIndex] || null;

    const nextWord = () => {
    setCurrentIndex(prev => prev + 1);
    };

        const handleKnow = () => {
    if (!currentWord) return;
    setKnownWords(prev => [...prev, currentWord]);
    nextWord();
    };

    const handleDontKnow = () => {
    if (!currentWord) return;
    setUnknownWords(prev => [...prev, currentWord]);
    nextWord();
    };

    return (
    <div className={styles.knownUnknown}>
        <div className={styles['main-cover']}>
        <div className={styles['cards-wrapper']}>
            {currentWord ? (
            <>
                <WordCard
                word={currentWord.english}
                transcription={currentWord.transcription}
                translation={currentWord.russian}
                theme={currentWord.tags}
                />
                <div className={styles['buttons-wrapper']}>
                <button onClick={handleKnow}>Знаю</button>
                <button onClick={handleDontKnow}>Не знаю</button>
                </div>
            </>
            ) : (
                <div className={styles['react-card-flip']}>
                    <div className={styles['reset-card']}>
                    <h2>Вы прошли все слова!</h2>
                    <button onClick={() => {
                        setCurrentIndex(0);
                        setKnownWords([]);
                        setUnknownWords([]);
                        }}>
                        Начать заново
                    </button>
                </div>
            </div>
            )}
        </div>
        </div>

        <div className={styles['folders-wrapper']}>
        <div className={`${styles.folder} ${styles.known}`}>
            <h3>Знаю</h3>
            {knownWords.map((word, index) => (
            <div className={styles['folder-word']} key={index}>{word.english}</div>
            ))}
        </div>
        <div className={`${styles.folder} ${styles.unknown}`}>
            <h3>Не знаю</h3>
            {unknownWords.map((word, index) => (
            <div className={styles['folder-word']} key={index}>{word.english}</div>
            ))}
        </div>
        </div>
    </div>
    );
};

export default KnownUnknown;
