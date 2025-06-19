import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleHeaderClick = () => {
    navigate('/'); 
    };

    return (
    <header onClick={handleHeaderClick} style={{cursor: 'pointer'}}>
        <div className="header" style={{maxWidth: '100%', display: 'flex', gap:'20px', flexDirection:'row', justifyContent:'center', alignItems:'center', height:'100px'}}>
            <img src="/book.png" alt="icon" style={{width: '100px', height: '100px'}}/>
            <h1 style={{height:'auto', marginTop:'30px'}}>ИЗУЧАЕМ АНГЛИЙСКИЙ</h1>
        </div>
    </header>
    );
};

export default Header;
