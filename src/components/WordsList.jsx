import React, { useState, useEffect } from "react";
import wordsData from "./Words";
import './wordslist.css';

const WordsList = () => {
    const [words, setWords] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedWord, setEditedWord] = useState({});
    const [selectedTag, setSelectedTag] = useState("all");
    const [validationErrors, setValidationErrors] = useState({});

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
        setValidationErrors({});
    }, [selectedTag]);

    const checkFieldEmpty = (fieldName, value) => {
        if (!value || value.trim() === "") {
            return "Поле не может быть пустым";
        }
        return null;
    };

    const checkAllFields = (wordData) => {
        const errors = {};
        const requiredFields = ['english', 'russian', 'transcription'];
        
        requiredFields.forEach(field => {
            const fieldValue = wordData[field] || "";
            const error = checkFieldEmpty(field, fieldValue);
            if (error) {
                errors[field] = error;
            }
        });
        
        return errors;
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setEditedWord(words[index]);
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedWord(prev => ({
            ...prev,
            [name]: value
        }));

        // Валидация в реальном времени
        const error = checkFieldEmpty(name, value);
        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSave = () => {
        // Полная валидация перед сохранением
        const errors = checkAllFields(editedWord);
        setValidationErrors(errors);

        // Если есть ошибки, показываем уведомление
        if (Object.keys(errors).length > 0) {
            alert("Ошибка: Пожалуйста, заполните все обязательные поля корректно.");
            return;
        }

        // Если все поля корректны, сохраняем и выводим в консоль
        const updatedWords = [...words];
        updatedWords[editingIndex] = editedWord;
        setWords(updatedWords);
        
        console.log("Сохранение слова:", {
            index: editingIndex,
            wordData: editedWord,
        });
        
        // Закрываем режим редактирования
        setEditingIndex(null);
        setEditedWord({});
        setValidationErrors({});
    };

    const handleDelete = (index) => {
        const updatedWords = words.filter((_, i) => i !== index);
        setWords(updatedWords);
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditedWord({});
            setValidationErrors({});
        }
    };

    // Проверяем, можно ли сохранить (нет ошибок и все поля заполнены)
    const canSave = () => {
        const englishValue = editedWord.english || "";
        const russianValue = editedWord.russian || "";
        const transcriptionValue = editedWord.transcription || "";
        
        if (!englishValue.trim() || !russianValue.trim() || !transcriptionValue.trim()) {
            return false;
        }
        
        const errors = checkAllFields(editedWord);
        return Object.keys(errors).length === 0;
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
                                style={{
                                    border: validationErrors.english ? '2px solid red' : '1px solid #ccc'
                                }}
                            />
                            <input
                                type="text"
                                name="russian"
                                value={editedWord.russian || ""}
                                onChange={handleInputChange}
                                style={{
                                    border: validationErrors.russian ? '2px solid red' : '1px solid #ccc'
                                }}
                            />
                            <input
                                type="text"
                                name="transcription"
                                value={editedWord.transcription || ""}
                                onChange={handleInputChange}
                                style={{
                                    border: validationErrors.transcription ? '2px solid red' : '1px solid #ccc'
                                }}
                            />
                            <button 
                                onClick={handleSave}
                                style={{
                                    backgroundColor: canSave() ? '#4CAF50' : '#cccccc',
                                    cursor: canSave() ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Сохранить
                            </button>
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