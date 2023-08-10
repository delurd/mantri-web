import React from 'react';
import s from './button.module.css';

// type Props = {};
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: Props) => {
  return (
    <button {...props} className={s.button}>
      {props.children}
    </button>
  );
};

export default Button;
