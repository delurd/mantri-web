import Image from 'next/image';
import s from './page.module.css';
import ButtonStatus from '@/components/ButtonStatus/ButtonStatus';
import InfoBanner from '@/components/InfoBanner/InfoBanner';
import {credentialKey, host} from '@/utils/variables';
import ClientLog from '@/components/ClientLog/ClientLog';
import moment from 'moment';

const getDataStatus = async () => {
  let dataReturn = {};
  const res = await fetch(host + '/api/practice-status', {
    method: 'POST',
    cache: 'no-store',
    headers: {credentialKey: credentialKey},
    body: JSON.stringify({time: moment().utcOffset(7).format()}),
  });
  const json = await res.json();
  const data = json.data;
  // console.log(data);

  return data;
};

export default async function Home() {
  const data = await getDataStatus();

  if (data?.information == 'offline') {
    return (
      <main className={'itemCenter main'}>
        <div className={s.offlineCard}>
          <h1 style={{fontWeight: '400', fontSize: '38px'}}>⚠</h1>
          <h3>
            Sistem sedang
            <br /> tidak aktif
          </h3>
        </div>
      </main>
    );
  }

  return (
    <main className={'itemCenter main'}>
      <div className={s.card}>
        <div style={{display: 'flex'}}>
          <div className={s.colTitle}>
            <h2>Praktik Mantri Mejeruk</h2>
          </div>
          <div className={s.colImage}>
            {/* <div className={s.illustrationImage} /> */}
            <Image
              src="/Illustration-doctor.png"
              alt="illustration"
              style={{position: 'absolute', bottom: 0, left: 0}}
              width={150}
              height={170}
              priority
            />
          </div>
        </div>
        <div className={s.itemCenter} style={{flexDirection: 'column'}}>
          <ButtonStatus status={data?.status} />
          <InfoBanner data={data} />
        </div>
        <ClientLog />
      </div>
    </main>
  );
}
