import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/post-model/feelings/feelings.scss';
import { RootState } from '@store/index';
import { FeelingDoc, addPostFeeling, toggleFeelingModal } from '@store/reducer/model';
import { feelingsList } from '@services/utils/Static.data';

const Feelings = ({ setToggleFeelings }: any) => {
  const { feelingsIsOpen } = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch();

  const selectFeeling = (feeling: FeelingDoc) => {
    dispatch(addPostFeeling(feeling));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
    setToggleFeelings((prev: boolean) => !prev);
  };

  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr />
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li
              data-testid="feelings-item"
              className="feelings-container-picker-list-item"
              key={feeling.index}
              onClick={() => selectFeeling(feeling)}
            >
              <img src={feeling.image} alt={feeling.name} /> <span>{feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Feelings;
