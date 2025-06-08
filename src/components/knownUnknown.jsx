import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import words from "./Words";
import './knownUnknown.css';

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
    <div className="knownUnknown">
        <div className="main-cover">
        <div className="cards-wrapper">
            {currentWord ? (
            <>
                <WordCard
                word={currentWord.english}
                transcription={currentWord.transcription}
                translation={currentWord.russian}
                theme={currentWord.tags}
                />
                <div className="buttons-wrapper">
                <button onClick={handleKnow}>Знаю</button>
                <button onClick={handleDontKnow}>Не знаю</button>
                </div>
            </>
            ) : (
            <div className="word-card-wrapper">
                <div className="react-card-flip">
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

        <div className="folders-wrapper">
        <div className="folder known">
            <h3>Знаю</h3>
            {knownWords.map((word, index) => (
            <div className="folder-word" key={index}>{word.english}</div>
            ))}
        </div>
        <div className="folder unknown">
            <h3>Не знаю</h3>
            {unknownWords.map((word, index) => (
            <div className="folder-word" key={index}>{word.english}</div>
            ))}
        </div>
        </div>
    </div>
    );
};

export default KnownUnknown;
