'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import s from './styles.module.css';
import {credentialKey, host} from '@/utils/variables';

type Props = {};

const Admin = (props: Props) => {
  const [jamMulai, setJamMulai] = useState('00:00');
  const [jamAkhir, setJamAkhir] = useState('00:00');
  const [jamPraktek, setJamPraktek] = useState([]);
  const [manualStatus, setManualStatus] = useState(false);
  const [loadingSetManualStatus, setLoadingSetManualStatus] = useState(false);

  const getJamPraktek = async () => {
    console.time('jadwal');

    const res = await fetch(host + '/api/data-jadwal', {
      headers: {credentialKey},
    });
    const json = await res.json();
    const data = json.data;
    // console.log(data);

    setJamPraktek(data);
    console.timeEnd('jadwal');
  };

  useEffect(() => {
    getJamPraktek();
    getManualStatus();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch(host + '/api/data-jadwal', {
      method: 'POST',
      headers: {credentialKey},
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
      headers: {credentialKey},
      body: JSON.stringify({id}),
    });
    const json = await res.json();

    const data = json.data;

    // console.log(data);
    setJamPraktek(data);
  };

  const handleManual = async (status: boolean) => {
    setLoadingSetManualStatus(true);
    try {
      const res = await fetch(host + '/api/use-status-manual', {
        method: 'POST',
        headers: {credentialKey},
        body: JSON.stringify({status}),
      });
      const json = await res.json();
      const data = json.data;

      setManualStatus(status);
      setLoadingSetManualStatus(false);
    } catch (error) {
      console.log(error);
      setLoadingSetManualStatus(false);
    }
  };

  const getManualStatus = async () => {
    console.time('status');

    const res = await fetch(host + '/api/use-status-manual', {
      method: 'GET',
      headers: {credentialKey},
    });
    const json = await res.json();
    const data = json.data;

    // console.log(json);
    console.timeEnd('status');

    if (json.message == 'failed') return;

    setManualStatus(data);
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
      <br />
      <div style={{backgroundColor: '#68b3dd', padding: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h3>Manual</h3>
          <input
            type="checkbox"
            checked={manualStatus}
            disabled={loadingSetManualStatus}
            onChange={(e) => {
              handleManual(e.target.checked);
            }}
          ></input>
        </div>
      </div>
    </main>
  );
};

export default Admin;
