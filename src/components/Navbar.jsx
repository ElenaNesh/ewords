import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

// В Navbar.jsx
function Navbar({ tags }) {
    return (
    <nav className='nav-bar'>
        <ul className='nav-li'>
        <li className="navbar-item">
            <Link to="/" className="navbar-link">
            Главная
            </Link>
        </li>
        {tags.map((tag, index) => (
            <li key={index} className="navbar-item" style={{listStyle:'none'}}>
            <Link to={`/topic/${tag}`} className="navbar-link">
                {tag}
            </Link>
            </li>
        ))}
        </ul>
    </nav>
    );
}

export default Navbar;