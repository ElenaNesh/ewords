import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WordsProvider } from './components/WordsContext';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TopicPage from './components/TopicPage';
import WordsList from './components/WordsList';
import Missing from './components/Missing';
import './App.css';

function App() {
  return (
    <WordsProvider>
      <div className='app'>
        <Router>
          <Header />
          <NavBar />
          <div className='main-wrapper'>
            <Routes>
              <Route path="/topic/:topicName" element={<TopicPage />} />
              <Route path="/" element={<WordsList />} />
              <Route path="*" element={<Missing />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </WordsProvider>
  );
}

export default App;