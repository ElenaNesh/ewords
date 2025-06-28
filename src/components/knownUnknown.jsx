import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import words from "./Words";
import styles from './knownUnknown.module.css'

const KnownUnknown = ({ selectedTopic }) => {
    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredWords, setFilteredWords] = useState([]);
    const [studiedWords, setStudiedWords] = useState(new Set());
    const [studiedCount, setStudiedCount] = useState(0); // Новое состояние для подсчета изученных слов

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
        setStudiedWords(new Set());
        setStudiedCount(0); // Сбрасываем счетчик при смене темы
    }, [selectedTopic]);

    const currentWord = filteredWords[currentIndex] || null;

    const nextWord = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const handleWordStudied = () => {
        if (currentWord && !studiedWords.has(currentWord.english)) {
            setStudiedWords(prev => new Set([...prev, currentWord.english]));
        }
    };

    const handleKnow = () => {
        if (!currentWord) return;
        setKnownWords(prev => [...prev, currentWord]);
        setStudiedCount(prev => prev + 1); // Увеличиваем счетчик изученных слов
        nextWord();
    };

    const handleDontKnow = () => {
        if (!currentWord) return;
        setUnknownWords(prev => [...prev, currentWord]);
        setStudiedCount(prev => prev + 1); // Увеличиваем счетчик изученных слов
        nextWord();
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setKnownWords([]);
        setUnknownWords([]);
        setStudiedWords(new Set());
        setStudiedCount(0); // Сбрасываем счетчик при сбросе игры
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
                                studiedCount={studiedCount} // Передаем счетчик изученных слов
                                totalWords={filteredWords.length}
                                currentIndex={currentIndex} // Передаем текущий индекс для автофокуса
                                onWordStudied={handleWordStudied}
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
                                <p>Изучено слов: {studiedCount}</p> {/* Показываем итоговый результат */}
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