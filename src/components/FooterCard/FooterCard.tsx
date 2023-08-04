'use client';

import React, {useMemo, useState} from 'react';
import s from './footerCard.module.css';
import {host} from '@/utils/variables';

type Props = {};

const FooterCard = (props: Props) => {
  const [data, setData] = useState<any>();

  const getDataStatus = useMemo(async () => {    
    let dataReturn = {status: 'open'};
    const res = await fetch(host + '/api/practice-status');
    const json = await res.json();

    const data = json.data;
    setData(data);
    return dataReturn;
  }, []);

  return (
    <div className={s.itemCenter} style={{flexDirection: 'column'}}>
      <b>{data?.status}</b>
    </div>
  );
};

export default FooterCard;
