import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWords } from './WordsContext';
import './navbar.css';

const Navbar = () => {
    const { getUniqueTags, loading } = useWords();
    const uniqueTags = getUniqueTags();
    const location = useLocation();

    // Функция для определения активного пути
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname === path;
    };

    // Функция для получения названия тега из URL
    const getTagFromPath = (pathname) => {
        const match = pathname.match(/^\/topic\/(.+)$/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    const currentTag = getTagFromPath(location.pathname);

    return (
        <nav className={`nav-bar ${loading ? 'loading' : ''}`}>
            {uniqueTags.length > 0 ? (
                <ul className="nav-li">
                    <li className="navbar-item">
                        <Link 
                            to="/" 
                            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Все слова
                        </Link>
                    </li>
                    {uniqueTags.map((tag, index) => {
                        const tagPath = `/topic/${encodeURIComponent(tag)}`;
                        const isTagActive = currentTag === tag;
                        
                        return (
                            <li key={index} className="navbar-item">
                                <Link 
                                    to={tagPath} 
                                    className={`navbar-link ${isTagActive ? 'active' : ''}`}
                                    title={`Перейти к теме: ${tag}`}
                                >
                                    {tag || 'Без темы'}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="nav-empty">
                    {loading ? 'Загрузка тем...' : 'Темы появятся после добавления слов'}
                </div>
            )}
        </nav>
    );
};

export default Navbar;