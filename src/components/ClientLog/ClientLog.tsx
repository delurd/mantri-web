'use client';

import moment from 'moment';
import React, {useEffect} from 'react';

type Props = {};

const ClientLog = (props: Props) => {
  useEffect(() => {
    console.log(moment().format() + '--' + moment.locale());
  }, []);
  return <></>;
};

export default ClientLog;
