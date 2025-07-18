import React, { createContext, useContext, useState, useEffect } from 'react';

const WordsContext = createContext();

export const useWords = () => {
    const context = useContext(WordsContext);
    if (!context) {
        throw new Error('useWords must be used within a WordsProvider');
    }
    return context;
};

const API_BASE_URL = 'http://itgirlschool.justmakeit.ru/api/words';

export const WordsProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузка всех слов
    const fetchWords = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWords(data);
        } catch (err) {
            setError('Ошибка при загрузке слов: ' + err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Добавление нового слова
    const addWord = async (wordData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wordData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newWord = await response.json();
            setWords(prev => [...prev, newWord]);
            return newWord;
        } catch (err) {
            setError('Ошибка при добавлении слова: ' + err.message);
            console.error('Add error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Обновление слова
    const updateWord = async (id, wordData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wordData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedWord = await response.json();
            setWords(prev => prev.map(word => 
                word.id === id ? updatedWord : word
            ));
            return updatedWord;
        } catch (err) {
            setError('Ошибка при обновлении слова: ' + err.message);
            console.error('Update error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Удаление слова (локальное)
    const deleteWord = (id) => {
        setWords(prev => prev.filter(word => word.id !== id));
    };

    // Получение уникальных тегов
    const getUniqueTags = () => {
        const tagsWithDefault = words.map(word => 
            word.tags && word.tags.trim() !== '' ? word.tags : 'Без темы'
        );
        return Array.from(new Set(tagsWithDefault));
    };

    // Фильтрация слов по тегу
    const getWordsByTag = (tag) => {
        if (tag === 'all') return words;
        return words.filter(word => {
            const wordTag = word.tags && word.tags.trim() !== '' ? word.tags : 'Без темы';
            return wordTag === tag;
        });
    };

    // Загрузка данных при монтировании
    useEffect(() => {
        fetchWords();
    }, []);

    const value = {
        words,
        loading,
        error,
        fetchWords,
        addWord,
        updateWord,
        deleteWord,
        getUniqueTags,
        getWordsByTag,
        setError
    };

    return (
        <WordsContext.Provider value={value}>
            {children}
        </WordsContext.Provider>
    );
};