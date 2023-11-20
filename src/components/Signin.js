import React, { useState } from 'react';
import style from '../css/signin.module.css';
import axios from 'axios';

function Signin() {
    const [data, setData] = useState({
        username: '' , password: ''
    });
    const [message, setMessage] = useState('');

    const signin = async () =>{
        // console.log(data);
        try{
            const response = await axios.post('http://localhost:3001/login',
            { username: data.username, password: data.password });
            // console.log(response);
            if(response.data.message === "SignIn Successful!"){
                localStorage.setItem('token', response.data.token);
                alert(response.data.message);
                window.location.href = '/';
            }
            else{
                alert(response.data.message);
                setMessage(response.data.message);
            }
        }
        catch(err){
            console.log(err);
        }

        // console.log(localStorage.token);
    }

  return (
    <div className={style.container}>
        <div className={style.title}>SIGN IN</div>
        <div className={style.content}>
            <input
                type='text'
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <input
                type='password'
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
        </div>
        <div className={style.signinbtn} onClick={() => signin()}>
            Sign in
        </div>
    </div>
  )
}

export default Signin