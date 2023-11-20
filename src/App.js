import style from './css/app.module.css';

import Navbar from './components/Navbar';
import Client from './Client';
import Signin from './components/Signin';
import { Route, Routes } from 'react-router-dom';


function App() {
  const isSignin = !!localStorage.token;

  return (
    <div className={style.container}>
      <nav><Navbar/></nav>
      {isSignin ? (
        <Client/>
      ) : (
        <div className={style.content}>
          <Routes>
            <Route path='/' Component={Signin}/>
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
