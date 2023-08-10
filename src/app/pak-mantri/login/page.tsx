'use client';
import React, {SyntheticEvent, useState} from 'react';
import s from './login.module.css';
import Button from '@/components/Button/Button';
import {credentialKey, host} from '@/utils/variables';
import {actionLogin, createCookies} from '@/app/action';
import {useRouter} from 'next/navigation';
import Loader from '@/components/Loader/Loader';

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    const res = await actionLogin(username, password);

    
    if (!res) {
      setLoadingLogin(false);
      alert('Login Gagal');
      return;
    }

    const data = res.data;
    // localStorage.setItem('token', data.token);
    await createCookies('token', data.token);
    router.replace('/pak-mantri');
  };

  return (
    <main className="main itemCenter">
      <div className={s.login}>
        <h1>Login</h1>
        <form>
          <div>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <br />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <br />
          <br />
          <Button
            disabled={!username || (!password && true) || loadingLogin}
            onClick={handleLogin}
          >
            {loadingLogin ? <Loader size={20} /> : 'Masuk'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default page;
