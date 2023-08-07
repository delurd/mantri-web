import React from 'react';
import s from './buttonStatus.module.css';
import {type} from 'os';

type statusType = 'open' | 'close' | '';

type Props = {
  status?: string;
};

const ButtonStatus = (props: Props) => {
  return (
    <div
      className={s.statusButton}
      style={
        props?.status == 'open'
          ? {backgroundColor: '#89EA93', color: '#4BA65F'}
          : {backgroundColor: '#EA8989', color: '#A64B4B'}
      }
    >
      <b>PRAKTIK {props?.status == 'open' ? 'BUKA' : 'TUTUP'}</b>
    </div>
  );
};

export default ButtonStatus;
