import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useWords } from "./WordsContext";
import WordCard from "./WordCard";
import styles from './knownUnknown.module.css'

const KnownUnknown = () => {
    const { topicName } = useParams(); // Получаем тему из URL
    const { getWordsByTag } = useWords(); // Используем контекст для получения слов
    
    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredWords, setFilteredWords] = useState([]);
    const [studiedWords, setStudiedWords] = useState(new Set());
    const [studiedCount, setStudiedCount] = useState(0);

    // Обновляем filteredWords при смене темы
    useEffect(() => {
        // Получаем слова для выбранной темы из контекста
        const newFiltered = getWordsByTag(topicName || 'all');
        
        setFilteredWords(newFiltered);
        setCurrentIndex(0);
        setKnownWords([]);
        setUnknownWords([]);
        setStudiedWords(new Set());
        setStudiedCount(0);
    }, [topicName, getWordsByTag]);

    const currentWord = filteredWords[currentIndex] || null;

    const nextWord = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const handleWordStudied = () => {
        if (currentWord && !studiedWords.has(currentWord.english)) {
            setStudiedWords(prev => new Set([...prev, currentWord.english]));
        }
    };

    const handleAnswer = (isKnown) => {
        if (!currentWord) return;

        if (isKnown) {
            setKnownWords(prev => [...prev, currentWord]);
        } else {
            setUnknownWords(prev => [...prev, currentWord]);
        }

        setStudiedCount(prev => prev + 1);
        handleWordStudied();
        nextWord();
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setKnownWords([]);
        setUnknownWords([]);
        setStudiedWords(new Set());
        setStudiedCount(0);
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
                                studiedCount={studiedCount}
                                totalWords={filteredWords.length}
                                currentIndex={currentIndex}
                                onWordStudied={handleWordStudied}
                            />
                            <div className={styles['buttons-wrapper']}>
                                <button onClick={() => handleAnswer(true)}>Знаю</button>
                                <button onClick={() => handleAnswer(false)}>Не знаю</button>
                            </div>
                        </>
                    ) : (
                        <div className={styles['react-card-flip']}>
                            <div className={styles['reset-card']}>
                                <h2>Вы прошли все слова!</h2>
                                <p>Изучено слов: {studiedCount}</p>
                                <button onClick={resetGame}>
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