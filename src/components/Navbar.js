import React from 'react';
import style from '../css/navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className={style.container}>
      <ul className={style.navmenu}>
        <li><Link to='/'>Monitor</Link></li>
        <li><Link to='/history'>History</Link></li>
      </ul>
    </div>
  )
}

export default Navbar