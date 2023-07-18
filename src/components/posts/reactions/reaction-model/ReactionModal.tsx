import useEffectOnce from '@hooks/useEffectOnce';

import { filter, orderBy, some } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/reactions/reaction-model/reactionModal.scss';
import { RootState } from '@store/index';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';
import { reactionsColor, reactionsMap } from '@services/utils/Static.data';
import ReactionWrapper from '@components/posts/model-wrappers/reactionWrapper/ReactionWrapper';
import ReactionList from '@components/posts/reactions/reaction-model/reactionList/ReactionList';
import { clearPost } from '@store/reducer/post';
import { closeModel } from '@store/reducer/model';

const ReactionsModal = () => {
  const { _id, reactions } = useSelector((state: RootState) => state.post);
  const [activeViewAllTab, setActiveViewAllTab] = useState<boolean>(true);
  const [formattedReactions, setFormattedReactions] = useState<any>([]);
  const [reactionType, setReactionType] = useState<any>('');
  const [reactionColor, setReactionColor] = useState<any>('');
  const [postReactions, setPostReactions] = useState<any[]>([]);
  const [reactionsOfPost, setReactionsOfPost] = useState<any>([]);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    try {
      const response: any = await postService.getPostReactions(`${_id}`);
      const orderedPosts: any = orderBy(response.data?.reactions, ['createdAt'], ['desc']);
      setPostReactions(orderedPosts);
      setReactionsOfPost(orderedPosts);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const closeReactionsModal = () => {
    dispatch(closeModel());
    dispatch(clearPost());
  };

  const viewAll = () => {
    setActiveViewAllTab(true);
    setReactionType('');
    setPostReactions(reactionsOfPost);
  };

  const reactionList = (type: any) => {
    setActiveViewAllTab(false);
    setReactionType(type);
    const exist = some(reactionsOfPost, (reaction: any) => reaction.type === type);
    const filteredReactions: any = exist ? filter(reactionsOfPost, (reaction: any) => reaction.type === type) : [];
    setPostReactions(filteredReactions);
    setReactionColor(reactionsColor[type]);
  };

  useEffectOnce(() => {
    getPostReactions();
    setFormattedReactions(Utils.formattedReactions(reactions));
  });

  return (
    <>
      <ReactionWrapper closeModal={closeReactionsModal}>
        <div className="modal-reactions-header-tabs">
          <ul className="modal-reactions-header-tabs-list">
            <li
              className={`${activeViewAllTab ? 'activeViewAllTab' : 'all'}`}
              onClick={viewAll}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              All
            </li>
            {formattedReactions.map((reaction: any, i: number) => (
              <li
                key={i}
                className={`${reaction.type === reactionType ? 'activeTab' : ''}`}
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: `${reaction.type === reactionType ? reactionColor : ''}`
                }}
                onClick={() => reactionList(reaction?.type)}
              >
                <img loading="lazy" src={`${reactionsMap[reaction?.type as keyof ReactObject]}`} alt="" />
                <span>{Utils.shortenLargeNumbers(reaction?.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-reactions-list">
          <ReactionList postReactions={postReactions} />
        </div>
      </ReactionWrapper>
    </>
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

export default ReactionsModal;
