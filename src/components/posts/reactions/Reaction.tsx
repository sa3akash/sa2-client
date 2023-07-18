import '@components/posts/reactions/reaction.scss';
import { reactionsMap } from '@services/utils/Static.data';

interface ReactObject {
  like: string;
  love: string;
  wow: string;
  sad: string;
  happy: string;
  angry: string;
}

const Reactions = ({ handleClick, showLabel = true }: { handleClick: any; showLabel?: boolean }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];

  return (
    <div className="reactions" data-testid="reactions">
      <ul>
        {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)} data-testid="reaction">
            {showLabel && <label>{reaction}</label>}
            <img loading="lazy" src={reactionsMap[reaction as keyof ReactObject]} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reactions;
