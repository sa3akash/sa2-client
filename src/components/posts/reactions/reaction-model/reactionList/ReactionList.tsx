import Avatar from '@components/avatar/Avatar';

import '@components/posts/reactions/reaction-model/reactionList/reactionList.scss';
import { reactionsMap } from '@services/utils/Static.data';

const ReactionList = ({ postReactions }: { postReactions: any[] }) => {
  return (
    <div className="modal-reactions-container" data-testid="modal-reactions-container">
      {postReactions.map((reaction: any, i: number) => (
        <div className="modal-reactions-container-list" key={i} data-testid="reaction-list">
          <div className="img">
            <Avatar
              name={reaction?.username}
              bgColor={reaction?.avatarColor}
              textColor="#ffffff"
              size={50}
              avatarSrc={reaction?.profilePicture}
            />
            <img src={`${reactionsMap[reaction?.type as keyof ReactObject]}`} alt="" className="reaction-icon" />
          </div>
          <span>{reaction?.username}</span>
        </div>
      ))}
    </div>
  );
};

interface ReactObject {
  like: string;
  love: string;
  wow: string;
  sad: string;
  happy: string;
  angry: string;
}

export default ReactionList;
