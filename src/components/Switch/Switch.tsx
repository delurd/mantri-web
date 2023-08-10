import React from 'react';
import s from './style.module.css';

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
  scale?: string;
};

const Switch = (props: Props) => {
  return (
    <label className={s.switch} style={{scale: props.scale}}>
      <input
        type="checkbox"
        disabled={props.disabled}
        checked={props.checked}
        onChange={props.onChange}
      />
      {/* <span className={s.before}></span> */}
      <span className={s.slider + ' ' + s.round}></span>
    </label>
  );
};

export default Switch;
