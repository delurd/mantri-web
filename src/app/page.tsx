import Image from 'next/image';
import s from './page.module.css';

const getDataStatus = async () => {
  let dataReturn = {};
  const res = await fetch('http://localhost:3000/api/practice-status');
  const json = await res.json();

  const data = json.data;
  return data;
};

export default async function Home() {
  const data = await getDataStatus();

  return (
    <div
      className={s.itemCenter}
      style={{
        height: '100vh',
        backgroundColor: 'white',
        backgroundImage: 'url("/bg-patern.png")',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className={s.card}>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, marginTop: '25px'}}>
            <h2>Praktik Mantri Mejeruk</h2>
          </div>
          <div style={{flex: 1, position: 'relative'}}>
            <Image
              src="/illustration-doctor.png"
              alt="illustration"
              style={{position: 'absolute', bottom: 0, right: 0}}
              width={150}
              height={170}
              priority
            />
          </div>
        </div>
        <div className={s.itemCenter} style={{flexDirection: 'column'}}>
          <div
            className={s.statusButton}
            style={
              data.status == 'open'
                ? {backgroundColor: '#89EA93', color: '#4BA65F'}
                : {backgroundColor: '#EA8989', color: '#A64B4B'}
            }
          >
            <b>{data.status == 'open' ? 'BUKA' : 'TUTUP'}</b>
          </div>
          {!data.information.includes('sholat') ? (
            <></>
          ) : (
            <div style={{marginTop: '10px'}}>
              <p
                style={{
                  // padding: '10px 20px',
                  // border: '1px solid #68B3DD',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              >
                {data.information}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
