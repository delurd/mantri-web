import Image from 'next/image';
import s from './page.module.css';
import ButtonStatus from '@/components/ButtonStatus/ButtonStatus';
import InfoBanner from '@/components/InfoBanner/InfoBanner';
import { host } from '@/utils/variables';
import ClientLog from '@/components/ClientLog/ClientLog';

const getDataStatus = async () => {
  let dataReturn = {};
  const res = await fetch(host+'/api/practice-status');
  const json = await res.json();

  const data = json.data;
  return data;
};

export default async function Home() {
  const data = await getDataStatus();

  return (
    <main
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
          <ButtonStatus status={data?.status} />
          <InfoBanner data={data} />
        </div>
        <ClientLog />
      </div>
    </main>
  );
}
