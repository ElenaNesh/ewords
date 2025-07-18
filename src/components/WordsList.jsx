import React, { useState, useEffect } from "react";
import { useWords } from "./WordsContext";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import './wordslist.css';

const WordsList = () => {
    const { 
        words, 
        loading, 
        error, 
        addWord, 
        updateWord, 
        deleteWord, 
        getUniqueTags, 
        getWordsByTag,
        setError 
    } = useWords();

    const [filteredWords, setFilteredWords] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedWord, setEditedWord] = useState({});
    const [selectedTag, setSelectedTag] = useState("all");
    const [validationErrors, setValidationErrors] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newWord, setNewWord] = useState({
        english: '',
        russian: '',
        transcription: '',
        tags: ''
    });

    // Получаем уникальные теги
    const uniqueTags = getUniqueTags();

    useEffect(() => {
        const filtered = getWordsByTag(selectedTag);
        setFilteredWords(filtered);
        setEditingIndex(null);
        setEditedWord({});
        setValidationErrors({});
    }, [selectedTag, words, getWordsByTag]);

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
        setEditedWord(filteredWords[index]);
        setValidationErrors({});
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditedWord({});
        setValidationErrors({});
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewWord({
            english: '',
            russian: '',
            transcription: '',
            tags: ''
        });
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

    const handleNewWordChange = (e) => {
        const { name, value } = e.target;
        setNewWord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Полная валидация перед сохранением
        const errors = checkAllFields(editedWord);
        setValidationErrors(errors);

        // Если есть ошибки, показываем уведомление
        if (Object.keys(errors).length > 0) {
            alert("Ошибка: Пожалуйста, заполните все обязательные поля корректно.");
            return;
        }

        try {
            await updateWord(editedWord.id, editedWord);
            console.log("Слово обновлено:", editedWord);
            
            // Закрываем режим редактирования
            setEditingIndex(null);
            setEditedWord({});
            setValidationErrors({});
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };

    const handleAddWord = async () => {
        // Валидация нового слова
        const errors = checkAllFields(newWord);
        if (Object.keys(errors).length > 0) {
            alert("Ошибка: Пожалуйста, заполните все обязательные поля корректно.");
            return;
        }

        try {
            const wordToAdd = {
                ...newWord,
                tags: newWord.tags.trim() || 'Без темы'
            };
            
            await addWord(wordToAdd);
            console.log("Новое слово добавлено:", wordToAdd);
            
            // Очищаем форму
            setNewWord({
                english: '',
                russian: '',
                transcription: '',
                tags: ''
            });
            setShowAddForm(false);
        } catch (error) {
            console.error("Ошибка при добавлении:", error);
        }
    };

    const handleDelete = (index) => {
        const wordToDelete = filteredWords[index];
        deleteWord(wordToDelete.id);
        
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

    const canAddWord = () => {
        const englishValue = newWord.english || "";
        const russianValue = newWord.russian || "";
        const transcriptionValue = newWord.transcription || "";
        
        return englishValue.trim() && russianValue.trim() && transcriptionValue.trim();
    };

    // Обработка ошибок
    const handleErrorDismiss = () => {
        setError(null);
    };

    if (loading) {
        return (
            <div className="words-list">
                <LoadingSpinner 
                    size="large" 
                    message="Загрузка слов..."
                />
            </div>
        );
    }

    return (
        <div className="words-list">
            <ErrorMessage 
                error={error}
                onDismiss={handleErrorDismiss}
                type="error"
                dismissible={true}
            />

            <div className="filter">
                <h2>Полный список слов к изучению</h2>
                <div className="filter-controls">
                    <label htmlFor="tagFilter">Фильтровать по тегу:</label>
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
                    
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="add-word-button"
                    >
                        {showAddForm ? 'Отменить' : 'Добавить слово'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="add-word-form">
                    <button 
                        onClick={handleCancelAdd}
                        className="close-button"
                        title="Закрыть"
                    >
                        ✕
                    </button>
                    <div className="form-header">
                        <h3>Добавить новое слово</h3>
                    </div>
                    <div className="word-row">
                        <input
                            type="text"
                            name="english"
                            placeholder="Английское слово"
                            value={newWord.english}
                            onChange={handleNewWordChange}
                        />
                        <input
                            type="text"
                            name="russian"
                            placeholder="Русский перевод"
                            value={newWord.russian}
                            onChange={handleNewWordChange}
                        />
                        <input
                            type="text"
                            name="transcription"
                            placeholder="Транскрипция"
                            value={newWord.transcription}
                            onChange={handleNewWordChange}
                        />
                        <input
                            type="text"
                            name="tags"
                            placeholder="Тег (необязательно)"
                            value={newWord.tags}
                            onChange={handleNewWordChange}
                        />
                        <button 
                            onClick={handleAddWord}
                            disabled={!canAddWord()}
                            className="add-button"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            )}

            {filteredWords.map((word, index) => (
                <div key={word.id} className="word-row">
                    {editingIndex === index ? (
                        <>
                            <input
                                type="text"
                                name="english"
                                value={editedWord.english || ""}
                                onChange={handleInputChange}
                                style={{
                                    border: validationErrors.english ? '2px solid #dc3545' : '1px solid #ddd'
                                }}
                            />
                            <input
                                type="text"
                                name="russian"
                                value={editedWord.russian || ""}
                                onChange={handleInputChange}
                                style={{
                                    border: validationErrors.russian ? '2px solid #dc3545' : '1px solid #ddd'
                                }}
                            />
                            <input
                                type="text"
                                name="transcription"
                                value={editedWord.transcription || ""}
                                onChange={handleInputChange}
                                style={{
                                    border: validationErrors.transcription ? '2px solid #dc3545' : '1px solid #ddd'
                                }}
                            />
                            <input
                                type="text"
                                name="tags"
                                value={editedWord.tags || ""}
                                onChange={handleInputChange}
                            />
                            <div className="edit-buttons">
                                <button 
                                    onClick={handleSave}
                                    disabled={!canSave()}
                                    className="save-button"
                                >
                                    {loading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(index)}
                                    className="delete-button"
                                >
                                    Удалить
                                </button>
                                <button 
                                    onClick={handleCancelEdit}
                                    className="cancel-edit-button"
                                    title="Отменить редактирование"
                                >
                                    ✕
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="words-list-main">
                                <p>{word.english}</p>
                                <p>{word.russian}</p>
                                <p>{word.transcription}</p>
                                <p className="word-tag">{word.tags || 'Без темы'}</p>
                            </div>
                            <div className="words-list-buttons">
                                <button 
                                    onClick={() => handleEditClick(index)}
                                    className="edit-button"
                                >
                                    Редактировать
                                </button>
                                <button 
                                    onClick={() => handleDelete(index)}
                                    className="delete-button"
                                >
                                    Удалить
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
            
            {filteredWords.length === 0 && !loading && (
                <div className="no-words">
                    <p>Слова не найдены</p>
                </div>
            )}
        </div>
    );
};

export default WordsList;