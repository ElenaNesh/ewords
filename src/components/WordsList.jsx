import React, { useState, useEffect } from "react";
import wordsData from "./Words";
import './wordslist.css';

const WordsList = () => {
    const [words, setWords] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedWord, setEditedWord] = useState({});
    const [selectedTag, setSelectedTag] = useState("all");

  // Получаем все уникальные теги
    const uniqueTags = Array.from(
    new Set(wordsData.map(word => word.tags.trim() || "Без темы"))
    );

    useEffect(() => {
    const filtered = selectedTag === "all"
        ? wordsData
        : wordsData.filter(word => (word.tags.trim() || "Без темы") === selectedTag);

    setWords(filtered);
    setEditingIndex(null);
    setEditedWord({});
    }, [selectedTag]);

    const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedWord(words[index]);
    };

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedWord(prev => ({
        ...prev,
        [name]: value
    }));
    };

    const handleSave = () => {
    const updatedWords = [...words];
    updatedWords[editingIndex] = editedWord;
    setWords(updatedWords);
    setEditingIndex(null);
    setEditedWord({});
    };

    const handleDelete = (index) => {
    const updatedWords = words.filter((_, i) => i !== index);
    setWords(updatedWords);
    if (editingIndex === index) {
        setEditingIndex(null);
        setEditedWord({});
    }
    };

    return (
    <div className="words-list">
        <div className="filter">
        <h2>Полный список слов к изучению</h2>
        <label htmlFor="tagFilter">Фильтровать по тегу: </label>
        <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
        >
            <option value="all">Все</option>
            {uniqueTags.map((tag, idx) => (
            <option key={idx} value={tag}>{tag || "Без темы"}</option>
            ))}
        </select>
        </div>

        {words.map((word, index) => (
        <div key={index} className="word-row">
            {editingIndex === index ? (
            <>
                <input
                type="text"
                name="english"
                value={editedWord.english || ""}
                onChange={handleInputChange}
                />
                <input
                type="text"
                name="russian"
                value={editedWord.russian || ""}
                onChange={handleInputChange}
                />
                <input
                type="text"
                name="transcription"
                value={editedWord.transcription || ""}
                onChange={handleInputChange}
                />
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={() => handleDelete(index)}>Удалить</button>
            </>
            ) : (
            <>
                <div className="words-list-main">
                <p style={{ fontWeight: 'bold' }}>{word.english}</p>
                <p>— {word.russian}</p>
                <p>({word.transcription})</p>
                </div>
                <div className="words-list-buttons">
                <button onClick={() => handleEditClick(index)}>Редактировать</button>
                <button onClick={() => handleDelete(index)}>Удалить</button>
                </div>
            </>
            )}
        </div>
        ))}
    </div>
    );
};

export default WordsList;
