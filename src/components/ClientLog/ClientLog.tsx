'use client';

import moment from 'moment';
import React, {useEffect} from 'react';

type Props = {};

const ClientLog = (props: Props) => {
  useEffect(() => {
    moment().utcOffset(0)
    
    console.log(moment().utcOffset(0).format());
    console.log(moment().format() + '--' + moment.locale());
  }, []);
  return <></>;
};

export default ClientLog;
