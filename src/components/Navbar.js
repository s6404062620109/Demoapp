import React from 'react';
import style from '../css/navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {

  const signout = () => {
    if(localStorage.length > 0){
      alert("token remove!!!");
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    else{
      alert("Not have token!");
    }
    // console.log(localStorage.length);
  }

  return (
    <div className={style.container}>
      <ul className={style.navmenu}>
        <li><Link to='/'>Monitor</Link></li>
        <li><Link to='/history'>History</Link></li>
        <li onClick={() => signout()} className={style.signoutbtn}>Sign out</li>
      </ul>
    </div>
  )
}

export default Navbar