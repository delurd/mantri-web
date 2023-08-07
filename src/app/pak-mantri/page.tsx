'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import s from './styles.module.css';
import {host} from '@/utils/variables';

type Props = {};

const Admin = (props: Props) => {
  const [jamMulai, setJamMulai] = useState('00:00');
  const [jamAkhir, setJamAkhir] = useState('00:00');
  const [jamPraktek, setJamPraktek] = useState([]);

  const getJamPraktek = async () => {
    const res = await fetch(host + '/api/data-jadwal', {
      headers: {credentialKey: 'credentialKey'},
    });
    const json = await res.json();
    const data = json.data;
    // console.log(data);

    setJamPraktek(data);
  };

  useEffect(() => {
    getJamPraktek();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch(host + '/api/data-jadwal', {
      method: 'POST',
      headers: {credentialKey: 'credentialKey'},
      body: JSON.stringify({startAt: jamMulai, endAt: jamAkhir}),
    });
    const json = await res.json();

    const data = json.data;

    // console.log(data);
    setJamPraktek(data);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(host + '/api/data-jadwal', {
      method: 'DELETE',
      headers: {credentialKey: 'credentialKey'},
      body: JSON.stringify({id}),
    });
    const json = await res.json();

    const data = json.data;

    // console.log(data);
    setJamPraktek(data);
  };

  return (
    <main className="main" style={{padding: '20px'}}>
      <div style={{backgroundColor: '#68b3dd', padding: '20px'}}>
        <h3>Tambah Jam Layanan</h3>
        <br />
        <form>
          <div>
            <label htmlFor="">Mulai</label>
            <br />
            <input
              value={jamMulai}
              type="time"
              className={s.inputClock}
              onChange={(e) => {
                setJamMulai(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="">Berakhir</label>
            <br />
            <input
              type="time"
              value={jamAkhir}
              className={s.inputClock}
              onChange={(e) => {
                setJamAkhir(e.target.value);
              }}
            ></input>
          </div>
          <br />
          <button style={{padding: '5px 15px'}} onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
      <br />
      <div style={{backgroundColor: '#68b3dd', padding: '20px'}}>
        <h3>Jam Layanan</h3>
        <br />
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '10px'}}>
          {jamPraktek.length
            ? jamPraktek.map((data: any) => (
                <div
                  key={data.id}
                  style={{display: 'flex', justifyContent: 'space-between'}}
                >
                  <p>
                    {data.start} - {data.end}
                  </p>
                  <button
                    onClick={() => {
                      handleDelete(data.id);
                    }}
                  >
                    delete
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </main>
  );
};

export default Admin;
