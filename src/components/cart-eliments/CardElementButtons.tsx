import Button from '@components/button/Button';
import React, { Fragment } from 'react';

interface CardElementProps {
  isChecked: boolean;
  btnTextOne: string;
  btnTextTwo: string;
  onClickBtnOne: () => void;
  onClickBtnTwo: () => void;
  onNavigateToProfile: () => void;
}

const CardElementButtons: React.FC<CardElementProps> = (props) => {
  return (
    <div className="card-element-buttons" data-testid="card-element-buttons">
      <Fragment>
        {!props.isChecked && (
          <Button
            label={props.btnTextOne}
            className="card-element-buttons-btn button"
            handleClick={props.onClickBtnOne}
          />
        )}
        {props.isChecked && (
          <Button
            label={props.btnTextTwo}
            className="card-element-buttons-btn button isUserFollowed"
            handleClick={props.onClickBtnTwo}
          />
        )}
      </Fragment>
      <Button label="Profile" className="card-element-buttons-btn button" handleClick={props.onNavigateToProfile} />
    </div>
  );
};

export default CardElementButtons;
