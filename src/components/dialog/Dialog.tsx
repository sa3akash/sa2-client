import React from 'react';
import '@components/dialog/Dialog.scss';
import Button from '@components/button/Button';

interface DialogProps {
  title: string;
  firstButtonText: string;
  secondButtonText: string;
  firstBtnHandler: () => void;
  secondBtnHandler: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  firstButtonText,
  secondButtonText,
  firstBtnHandler,
  secondBtnHandler
}) => {
  return (
    <div className="dialog-container" data-testid="dialog-container">
      <div className="dialog">
        <h4>{title}</h4>
        <div className="btn-container">
          <Button className="btn button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} />
          <Button className="btn button confirm-btn" label={firstButtonText} handleClick={firstBtnHandler} />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
