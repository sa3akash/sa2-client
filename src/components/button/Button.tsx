import React from 'react';

interface ButtonTypes {
  label: string;
  className: string;
  disabled?: boolean;
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Button: React.FC<ButtonTypes> = ({ label, className, disabled, handleClick }) => {
  return (
    <button className={className} onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
