'use client';

import {host} from '@/utils/variables';
import moment from 'moment';
import React, {useEffect} from 'react';

type Props = {};

const ClientLog = (props: Props) => {
  useEffect(() => {
    getDataStatus();
    console.log(moment().utcOffset(0).format());
    console.log(moment().format() + '--' + moment.locale());
  }, []);

  const getDataStatus = async () => {
    const res = await fetch(host + '/api/practice-status');
    const json = await res.json();

    const data = json.data;

    console.log(data);
  };
  return <></>;
};

export default ClientLog;
