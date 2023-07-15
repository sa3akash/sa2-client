import { FaSpinner } from 'react-icons/fa';
import '@components/posts/reactions/reactionAndComment/reactionAndComment.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@store/index';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';
import { updatePostItem } from '@store/reducer/post';
import { toggleCommentsModal, toggleReactionsModal } from '@store/reducer/model';
import { reactionsMap } from '@services/utils/Static.data';

const ReactionsAndCommentsDisplay = ({ post }: { post: any }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen } = useSelector((state: RootState) => state.model);
  const [postReactions, setPostReactions] = useState<any>([]);
  const [reactions, setReactions] = useState<any>([]);
  const [postCommentNames, setPostCommentNames] = useState<any>([]);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    try {
      const response: any = await postService.getPostReactions(post?._id);
      setPostReactions(response.data?.reactions);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data?.message });
      }
    }
  };

  const getPostCommentsNames = async () => {
    try {
      const response: any = await postService.getPostCommentsNames(post?._id);
      setPostCommentNames([...new Set(response.data?.comments?.names)]);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data?.message });
      }
    }
  };

  const sumAllReactions = (reactions: any) => {
    if (reactions?.length) {
      const result: number = reactions
        .map((item: any) => item.value)
        .reduce((prev: number, next: number) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
  };

  const openReactionsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  const openCommentsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(!commentsModalIsOpen));
  };

  useEffect(() => {
    setReactions(Utils.formattedReactions(post?.reactions));
  }, [post]);

  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactions.length > 0 &&
              reactions.map((reaction: any) => (
                <div className="tooltip-container" key={reaction?.type}>
                  <img
                    data-testid="reaction-img"
                    className="reaction-img"
                    src={`${reactionsMap[reaction?.type as keyof ReactObject]}`}
                    alt=""
                    onMouseEnter={getPostReactions}
                  />
                  <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                    <p className="title">
                      <img className="title-img" src={`${reactionsMap[reaction?.type as keyof ReactObject]}`} alt="" />
                      {reaction?.type.toUpperCase()}
                    </p>
                    <div className="likes-block-icons-list">
                      {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                      {postReactions.length && (
                        <>
                          {postReactions.slice(0, 19).map((postReaction: any, i: number) => (
                            <div key={i}>
                              {postReaction?.type === reaction?.type && (
                                <span key={postReaction?._id}>{postReaction?.username}</span>
                              )}
                            </div>
                          ))}
                          {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <span
            data-testid="reactions-count"
            className="tooltip-container reactions-count"
            onMouseEnter={getPostReactions}
            onClick={() => openReactionsComponent()}
          >
            {sumAllReactions(reactions)}

            <div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
              <div className="likes-block-icons-list">
                {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                {postReactions.length && (
                  <>
                    {postReactions.slice(0, 19).map((reaction: any, i: number) => (
                      <span key={i}>{reaction?.username}</span>
                    ))}
                    {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                  </>
                )}
              </div>
            </div>
          </span>
        </div>
      </div>
      <div
        className="comment tooltip-container"
        data-testid="comment-container"
        onClick={() => openCommentsComponent()}
      >
        {post?.commentsCount > 0 && (
          <span onMouseEnter={getPostCommentsNames} data-testid="comment-count">
            {Utils.shortenLargeNumbers(post?.commentsCount)} {`${post?.commentsCount === 1 ? 'Comment' : 'Comments'}`}
          </span>
        )}
        <div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
          <div className="likes-block-icons-list">
            {postCommentNames.length === 0 && <FaSpinner className="circle-notch" />}
            {postCommentNames.length && (
              <>
                {postCommentNames.slice(0, 19).map((names: any, i: number) => (
                  <span key={i}>{names}</span>
                ))}
                {postCommentNames.length > 20 && <span>and {postCommentNames.length - 20} others...</span>}
              </>
            )}
          </div>
        </div>
      </div>
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

export default ReactionsAndCommentsDisplay;
