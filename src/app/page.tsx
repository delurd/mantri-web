import Image from 'next/image';
import s from './page.module.css';

export default function Home() {
  return (
    <main>
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
          <div className={s.itemCenter} style={{flexDirection: 'column'}}></div>
        </div>
      </div>
    </main>
  );
}
