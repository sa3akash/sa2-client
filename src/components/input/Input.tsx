import '@components/input/index.scss';
import React, { forwardRef } from 'react';

interface InputInterfacts {
  name?: string;
  type?: string;
  id?: string;
  labelText?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  handleChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  style?: object;
}

const Input = forwardRef((props: InputInterfacts, ref: React.LegacyRef<HTMLInputElement>) => (
  <div className="form-row">
    {props.labelText && (
      <label htmlFor={props.name} className="form-label">
        {props.labelText}
      </label>
    )}
    <input
      ref={ref}
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      className={`form-input ${props.className}`}
      style={props.style}
      autoComplete="false"
    />
  </div>
));

Input.displayName = 'Input';

export default Input;
