import React from 'react';
import s from './loader.module.css';
type Props = {
  scale?: string;
  size?: number;
};

const Loader = (props: Props) => {
  return (
    <div
      className={s.loader}
      style={{
        scale: props.scale,
        width: props.size + 'px',
        height: props.size + 'px',
        border: (props.size ? props.size / 5 : '6') + 'px solid #f3f3f3',
        borderTop: (props.size ? props.size / 5 : '6') + 'px solid #3498db',
      }}
    />
  );
};

export default Loader;
