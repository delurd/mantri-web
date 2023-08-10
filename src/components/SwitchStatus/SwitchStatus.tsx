import React, {useEffect, useState} from 'react';
import s from './switchStatus.module.css';

type Props = {
  disabled?: boolean;
  getStatus?: (status: string) => void;
  status?: string;
  loading?: boolean;
};

const SwitchStatus = (props: Props) => {
  const [status, setStatus] = useState(props.status);

  // useEffect(() => {
  //   props.getStatus && props.getStatus(status);
  // }, [status]);

  const handleChangeStatus = (status: string) => {
    // setStatus(status);
    props.getStatus && props.getStatus(status);
  };

  return (
    <div
      className={s.switchStatus}
      style={props.disabled ? {opacity: '0.5'} : {}}
    >
      <div
        onClick={() => {
          !props.disabled && handleChangeStatus('close');
        }}
        className={
          s.switchItem + ' ' + (props?.status == 'close' && s.switchActive)
        }
        style={props?.status == 'close' ? {backgroundColor: '#EA8989'} : {}}
      >
        Tutup
      </div>
      <div
        onClick={() => {
          !props.disabled && handleChangeStatus('open');
        }}
        className={
          s.switchItem + ' ' + (props?.status == 'open' && s.switchActive)
        }
        style={props?.status == 'open' ? {backgroundColor: '#4BA65FCF'} : {}}
      >
        Buka
      </div>
    </div>
  );
};

export default SwitchStatus;
