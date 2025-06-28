import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import words from './components/Words';
import Header from './components/Header';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import TopicPage from './components/TopicPage';
import WordsList from './components/WordsList';
import Missing from './components/Missing'
import './App.css';

function App() {
  const tagsWithDefault = words.map(word => word.tags.trim() === '' ? 'Без темы' : word.tags);
  const uniqueTags = Array.from(new Set(tagsWithDefault));

  return (
    <div className='app'>
    <Router>
        <Header />
        <Navbar tags={uniqueTags} />
          <div className='main-wrapper'>
            <Routes>
              <Route path="/topic/:topicName" element={<TopicPage />} />
              <Route path="/" element={<WordsList/>} />
              <Route path="*" element={<Missing/>} />
            </Routes>
          </div>

      <Footer />
    </Router>
    </div>
  );
}

export default App;
