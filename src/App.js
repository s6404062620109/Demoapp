import style from './css/app.module.css';
import { Route, Routes } from 'react-router-dom';

import History from './components/History';
import Escalator from './components/Escalator';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className={style.container}>
      <nav><Navbar/></nav>
      <div className={style.content}>
      <Routes>
        <Route path='/' Component={Escalator}/>
        <Route path='/history' Component={History}/>
      </Routes>
      </div>
    </div>
  );
}

export default App;
