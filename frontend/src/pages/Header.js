import React from 'react';
import './header.css';

function Header() {
    return (
        <header className="row">
            <div className="col-md-2"><img src="/imgs/gomibologo.png" className="logoHeader" alt="logo"/></div>
            <div className="col-md-6"></div>
            <div className="col-md-2 header-btn">Dashboard</div>
            <div className="col-md-2 header-btn">Contact Us</div>
        </header>
    );
}

export default Header;
