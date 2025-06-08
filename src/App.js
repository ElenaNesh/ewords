import React, { useState } from 'react';
import Topic from './components/Topics';
import words from './components/Words';
import KnownUnknown from './components/KnownUnknown';
import WordsList from './components/WordsList';
import './App.css';

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const tagsWithDefault = words.map(word => word.tags.trim() === '' ? 'Без темы' : word.tags);
  const uniqueTags = Array.from(new Set(tagsWithDefault));
  const handleTopicClick = (tag) => {
    setSelectedTopic(tag);
  };
  return (
    <>
      <h1>Изучаем английский</h1>
      <div className='main-wrapper'>
        <aside>
          <h3>Выберите категорию</h3>
          {uniqueTags.map((tag, index) => (
            <div key={index} onClick={() => handleTopicClick(tag)} className='topic-button'>
            <Topic key={index} name={tag}/>
            </div>
          ))}
        </aside>
        <div className="app-container">
          <h2>Текущая тема: {selectedTopic}</h2>
          <KnownUnknown selectedTopic={selectedTopic} />
          <h2>Список всех слов в категории</h2>
          <WordsList selectedTopic={selectedTopic} />
        </div>
      </div>
    <footer>
      <p>Изучаем английский</p>
    </footer>
    </>
  );
}

export default App;
