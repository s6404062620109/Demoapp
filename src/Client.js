import React from 'react';
import { Route, Routes } from 'react-router-dom';
import style from './css/client.module.css';

import History from './components/History';
import Escalator from './components/Escalator';
import Signin from './components/Signin';

function Client() {
  return (
    <div className={style.container}>
        <Routes>
          <Route path='/' Component={Escalator}/>
          <Route path='/history' Component={History}/>
          <Route path='/Signin' Component={Signin}/>
        </Routes>
    </div>
  )
}

export default Client