'use client';

import {credentialKey, host} from '@/utils/variables';
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
    const res = await fetch(host + '/api/practice-status', {
      method: 'POST',
      cache: 'no-store',
      headers: {credentialKey: 'credentialKey'},
      body: JSON.stringify({time: moment().utcOffset(7).format()}),
    });
    const json = await res.json();

    const data = json.data;

    console.log(data);
  };
  return <></>;
};

export default ClientLog;
