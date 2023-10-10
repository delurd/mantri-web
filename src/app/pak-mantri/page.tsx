'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import s from './styles.module.css';
import {credentialKey, host} from '@/utils/variables';
import Switch from '@/components/Switch/Switch';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import Image from 'next/image';
import moment from 'moment';
import {useRouter} from 'next/navigation';
import {cekCookies, cekIsSensorOnline, handleLogout} from '../action';
import SwitchStatus from '@/components/SwitchStatus/SwitchStatus';

type Props = {};

const Admin = (props: Props) => {
  const router = useRouter();
  const [statusPraktik, setStatusPraktik] = useState('');
  const [jamMulai, setJamMulai] = useState('00:00');
  const [jamAkhir, setJamAkhir] = useState('00:00');
  const [jamPraktek, setJamPraktek] = useState([]);
  const [manualStatus, setManualStatus] = useState(false);
  const [loadingSetManualStatus, setLoadingSetManualStatus] = useState(false);
  const [manualStatusPractice, setManualStatusPractice] = useState('');
  const [doorSensorStatus, setDoorSensorStatus] = useState(false);
  const [isSensorOnline, setIsSensorOnline] = useState('');

  const [hashPage, setHashPage] = useState<string>('otomatis');

  useEffect(() => {
    // if(true) throw new Error('403')
    const page = location.hash.replace('#', '');
    page && setHashPage(page);
  }, []);

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

  const getDataStatus = async () => {
    let dataReturn = {};
    const res = await fetch(host + '/api/practice-status', {
      method: 'POST',
      cache: 'no-store',
      headers: {credentialKey},
      body: JSON.stringify({time: moment().utcOffset(7).format()}),
    });
    const json = await res.json();

    if (json.message == 'failed') return;

    const data = json.data;

    console.log(data);
    setStatusPraktik(data?.status);
  };

  const getDoorSensorStatus = async () => {
    const res = await fetch(host + '/api/door-sensor-status', {
      headers: {credentialKey},
    });
    const json = await res.json();

    if (json.message !== 'success') return;

    console.log(json);

    const data = json.data;
    const time = json.time;

    const isOnline = await cekIsSensorOnline(time);

    setIsSensorOnline(isOnline ? 'Online' : 'Offline');

    setDoorSensorStatus(data);
  };

  const getManualStatusPractice = async () => {
    const res = await fetch(host + '/api/use-status-manual/practice-status', {
      headers: {credentialKey},
    });
    const json = await res.json();
    if (res.status !== 200) {
      console.log(json);
      return;
    }

    const data = json.data;
    setManualStatusPractice(data.status);
  };

  const submitManualStatusPractice = async (status: string) => {
    const res = await fetch(host + '/api/use-status-manual/practice-status', {
      method: 'POST',
      headers: {credentialKey},
      body: JSON.stringify({status}),
    });
    const json = await res.json();
    if (res.status !== 200) {
      console.log(json);
      return;
    }

    const data = json.data;
    setManualStatusPractice(data.status);
    setStatusPraktik(data.status);
  };

  // const getSensorOnline = async () => {
  //   console.log('ini response door sensor');

  //   try {
  //     const res = await fetch('http://192.168.134.88/status', {
  //       mode: 'cors',
  //       method: 'GET',
  //     });

  //     setIsSensorOnline('Online');
  //   } catch (error) {
  //     setIsSensorOnline('Offline');
  //   }
  //   console.log('ini response door sensor end');

  //   // try {
  //   //   console.log('mulai');

  //   //   const socket = new WebSocket('ws://192.168.134.88:80');

  //   //   socket.onopen = (event) => {
  //   //     setIsSensorOnline('Online');
  //   //     console.log(new Date());
  //   //   };

  //   //   socket.onclose = (event) => {
  //   //     console.log('diconnect');
  //   //     console.log(new Date());
  //   //     setIsSensorOnline('Offline');

  //   //     setTimeout(function () {
  //   //       getSensorOnline();
  //   //     }, 60000);
  //   //   };

  //   //   console.log('selesai');

  //   // } catch (error) {
  //   //   setIsSensorOnline('Offline');
  //   // }
  // };

  useEffect(() => {
    getJamPraktek();
    getManualStatus();
    getDataStatus();
    getManualStatusPractice();
    getDoorSensorStatus();
    // getSensorOnline();
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
      setStatusPraktik(manualStatusPractice);
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

  const handleSensorManual = async (status: boolean) => {
    try {
      const res = await fetch(host + '/api/door-sensor-status/set-usage', {
        method: 'POST',
        headers: {credentialKey},
        body: JSON.stringify({status}),
      });
    } catch (error) {}
  };

  const getSensorManual = async () => {
    try {
      const res = await fetch(host + '/api/door-sensor-status/set-usage', {
        method: 'GET',
        headers: {credentialKey},
      });

      const json = await res.json();

      console.log(json);
    } catch (error) {}
  };

  const _Manualpage = () => {
    return (
      <>
        <div>
          <div className={s.card}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3>Atur Manual</h3>
              <div style={{display: 'flex', alignItems: 'center'}}>
                {loadingSetManualStatus ? <Loader scale="0.3" /> : <></>}
                <Switch
                  checked={manualStatus}
                  disabled={loadingSetManualStatus}
                  onChange={(e) => {
                    handleManual(e.target.checked);
                  }}
                  scale="0.7"
                />
              </div>
            </div>
            <br />
            <div>
              <SwitchStatus
                disabled={!manualStatus}
                status={manualStatusPractice}
                getStatus={(value) => {
                  submitManualStatusPractice(value);
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const _OtomatisPage = () => {
    return (
      <>
        <div className={s.card}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3>Sensor Pintu</h3>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {loadingSetManualStatus ? <Loader scale="0.3" /> : <></>}
              <Switch checked scale="0.7" onChange={() => {}} />
            </div>
          </div>
          {isSensorOnline ? (
            <p
              style={{
                fontSize: '14px',
                color: isSensorOnline == 'Online' ? '#4BA65FCF' : '#EA8989',
              }}
            >
              {isSensorOnline}
            </p>
          ) : (
            <Loader size={12} />
          )}
          <br />
          <div>
            <p style={{marginBottom: '5px', color: 'grey'}}>Status :</p>
            <SwitchStatus
              disabled={!isSensorOnline || isSensorOnline == 'Offline'}
              status={doorSensorStatus ? 'open' : 'close'}
              getStatus={(value) => {}}
            />
          </div>
        </div>
        <div>
          <div className={s.card}>
            <h3>Jam Layanan</h3>
            <br />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '20px',
              }}
            >
              {jamPraktek.length
                ? jamPraktek.map((data: any) => (
                    <div
                      key={data.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p style={{fontSize: '20px'}}>
                          {data.start} - {data.end}
                        </p>
                        <span>Setiap Hari</span>
                      </div>
                      <button
                        title="Hapus"
                        className={s.buttonDelete + ' itemCenter'}
                        onClick={() => {
                          if (
                            confirm(
                              `Ingin Menghapus Jam Layanan ${
                                data.start + '-' + data.end
                              } ?`
                            ) == true
                          ) {
                            handleDelete(data.id);
                          }
                        }}
                      >
                        <span />
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
        <div className={s.card}>
          <h3>Tambah Jam Layanan</h3>
          <br />
          <form>
            <div>
              <label htmlFor="">Mulai :</label>
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
              <label htmlFor="">Berakhir :</label>
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
            {/* <button style={{padding: '5px 15px'}} onClick={handleSubmit}>
              Submit
            </button> */}
            <Button onClick={handleSubmit}>Submit</Button>
          </form>
        </div>
      </>
    );
  };

  return (
    <main className="main" style={{padding: '20px'}}>
      <div
        className="itemCenter"
        style={{padding: '20px 0', marginBottom: '70px'}}
      >
        <div>
          <div style={{position: 'relative', color: 'black'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div>
                <Image
                  src="/Illustration-doctor.png"
                  alt="illustration"
                  width={100}
                  height={120}
                  priority
                />
              </div>
              <div>
                <br />
                <h2>Mantri Mejeruk</h2>
                <p>
                  Sekarang{' '}
                  {statusPraktik
                    ? statusPraktik == 'open'
                      ? 'Buka'
                      : 'Tutup'
                    : '-'}
                </p>
                <div
                  className={s.buttonLogout}
                  onClick={async () => {
                    const isLogout = await handleLogout();
                    isLogout && router.replace('/pak-mantri/login');
                  }}
                >
                  Logout
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M9 0.05V2.062C6.98271 2.31868 5.13885 3.33387 3.84319 4.90122C2.54752 6.46857 1.89728 8.47047 2.02462 10.5C2.15196 12.5296 3.04733 14.4345 4.52874 15.8276C6.01016 17.2207 7.96645 17.9975 10 18C11.9486 18 13.8302 17.2888 15.2917 16C16.7533 14.7112 17.6942 12.9333 17.938 11H19.951C19.449 16.053 15.185 20 10 20C4.477 20 0 15.523 0 10C0 4.815 3.947 0.551 9 0.05ZM18 3.414L10 11.414L8.586 10L16.586 2H12V0H20V8H18V3.414Z"
                      fill="#09121F"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className={s.containerBox}>
            {hashPage == 'otomatis' ? _OtomatisPage() : _Manualpage()}
          </div>
        </div>
      </div>
      <div className={s.menuBar}>
        <div className={s.menuContainer}>
          <a
            href="#otomatis"
            onClick={() => {
              setHashPage('otomatis');
            }}
            className={
              s.menuItem + ' ' + (hashPage == 'otomatis' && s.itemActive)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M15.671 28.7296C8.45854 28.7296 2.61206 22.8831 2.61206 15.6707C2.61206 8.45823 8.45854 2.61176 15.671 2.61176C22.8834 2.61176 28.7299 8.45823 28.7299 15.6707C28.7299 22.8831 22.8834 28.7296 15.671 28.7296ZM21.9654 22.2994C23.5417 20.8053 24.5346 18.7987 24.7661 16.6391C24.9976 14.4796 24.4526 12.3081 23.2287 10.5138C22.0049 8.71955 20.1821 7.41965 18.0871 6.847C15.992 6.27436 13.7615 6.46639 11.7951 7.3887L13.0683 9.68054C14.062 9.24867 15.1476 9.07086 16.2271 9.16314C17.3066 9.25542 18.3463 9.6149 19.2522 10.2092C20.1582 10.8034 20.902 11.6138 21.4167 12.5672C21.9314 13.5207 22.2007 14.5872 22.2004 15.6707H18.2828L21.9654 22.2994ZM19.5469 23.9526L18.2736 21.6608C17.2799 22.0927 16.1944 22.2705 15.1148 22.1782C14.0353 22.0859 12.9957 21.7264 12.0897 21.1322C11.1838 20.5379 10.4399 19.7275 9.92522 18.7741C9.41055 17.8207 9.14122 16.7541 9.14152 15.6707H13.0592L9.37658 9.04196C7.80022 10.5361 6.80736 12.5427 6.57586 14.7022C6.34437 16.8618 6.88936 19.0332 8.11321 20.8275C9.33706 22.6218 11.1598 23.9217 13.2549 24.4943C15.35 25.067 17.5805 24.8749 19.5469 23.9526V23.9526Z"
                fill={`${hashPage == 'otomatis' ? 'white' : '#68B3DD'}`}
              />
            </svg>
            {hashPage == 'otomatis' ? 'Otomatis' : ''}
          </a>
          <a
            href="#manual"
            onClick={() => {
              setHashPage('manual');
            }}
            className={
              s.menuItem + ' ' + (hashPage == 'manual' && s.itemActive)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M15.6706 1.30588L28.0766 8.48828V22.8531L15.6706 30.0355L3.26465 22.8531V8.48828L15.6706 1.30588ZM15.6706 19.5884C16.7096 19.5884 17.7061 19.1756 18.4408 18.4409C19.1755 17.7062 19.5883 16.7097 19.5883 15.6707C19.5883 14.6316 19.1755 13.6352 18.4408 12.9005C17.7061 12.1658 16.7096 11.753 15.6706 11.753C14.6316 11.753 13.6351 12.1658 12.9004 12.9005C12.1657 13.6352 11.7529 14.6316 11.7529 15.6707C11.7529 16.7097 12.1657 17.7062 12.9004 18.4409C13.6351 19.1756 14.6316 19.5884 15.6706 19.5884Z"
                fill={`${hashPage == 'manual' ? 'white' : '#68B3DD'}`}
              />
            </svg>
            {hashPage == 'manual' ? 'Manual' : ''}
            {manualStatus ? (
              <p
                style={{
                  backgroundColor: 'green',
                  borderRadius: '50px',
                  padding: '3px',
                  fontSize: '10px',
                  color: 'white',
                }}
              >
                on
              </p>
            ) : (
              ''
            )}
          </a>
        </div>
      </div>
    </main>
  );
};

export default Admin;
