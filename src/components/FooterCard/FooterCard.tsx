import React from 'react';
import s from './footerCard.module.css';

type Props = {};

const getDataStatus = async () => {
  let dataReturn = {status : 'open'};
//   const res = await fetch('http://localhost:3000/api/practice-status');
//   const json = await res.json();

//   const data = json.data;
  return dataReturn;
};

const FooterCard = async (props: Props) => {
  const data = await getDataStatus();
  return (
    <div className={s.itemCenter} style={{flexDirection: 'column'}}>
      <b>{data.status}</b>
    </div>
  );
};

export default FooterCard;
