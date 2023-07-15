import { FaRegCommentAlt } from 'react-icons/fa';
import '@components/posts/comment-area/commentArea.scss';
import { useCallback, useEffect, useState } from 'react';
import { cloneDeep, filter, find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import useLocalStorage from '@hooks/useLocalStorage';
import { RootState } from '@store/index';
import { Utils } from '@services/utils/Utils.services';
import { clearPost, updatePostItem } from '@store/reducer/post';
import { postService } from '@services/api/post/post.services';
import { AxiosError } from 'axios';
import { socketService } from '@services/sockets/socket.services';
import Reactions from '@components/posts/reactions/Reaction';
import { reactionsMap } from '@services/utils/Static.data';
import { addReactions } from '@store/reducer/userPostReaction';

interface CommentAreaProps {
  post: any;
}

const CommentArea = ({ post }: CommentAreaProps) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { reactions } = useSelector((state: RootState) => state.userReactions);
  const [userSelectedReaction, setUserSelectedReaction] = useState<string>('like');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const [setSelectedPostId] = useLocalStorage('selectedPostId', 'set');
  const dispatch = useDispatch();

  const selectedUserReaction = useCallback(
    (postReactions: any[]) => {
      const userReaction = find(postReactions, (reaction) => reaction.postId === post._id);
      const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : 'Like';
      setUserSelectedReaction(result);
    },
    [post]
  );

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [reactions, selectedUserReaction]);

  const toggleCommentInput = () => {
    if (!selectedPostId) {
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    } else {
      removeSelectedPostId();
    }
  };

  const removeSelectedPostId = () => {
    if (selectedPostId === post?._id) {
      setSelectedPostId('');
      dispatch(clearPost());
    } else {
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    }
  };

  const addReactionPost = async (reaction: any) => {
    try {
      const reactionResponse: any = await postService.getSinglePostReactionByUsername(
        post?._id,
        `${profile?.username}`
      );
      post = updatePostReactions(
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      const postReactions = addNewReaction(
        reaction,
        Object.keys(reactionResponse.data?.reactions).length,
        reactionResponse.data?.reactions?.type
      );
      const addReaction = [...postReactions];
      dispatch(addReactions(addReaction));

      sendSocketIOReactions(
        post,
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      const reactionsData = {
        userTo: post?.userId,
        postId: post?._id,
        type: reaction,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture,
        previousReaction: Object.keys(reactionResponse.data?.reactions).length
          ? reactionResponse.data?.reactions?.type
          : ''
      };

      if (!Object.keys(reactionResponse.data.reactions).length) {
        await postService.addReaction(reactionsData);
      } else {
        reactionsData.previousReaction = reactionResponse.data?.reactions?.type;
        if (reaction === reactionsData.previousReaction) {
          await postService.removeReaction(`${post?._id}`, reactionsData.previousReaction, post.reactions);
        } else {
          await postService.addReaction(reactionsData);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data?.message });
      }
    }
  };

  const updatePostReactions = (newReaction: any, hasResponse: any, previousReaction: any) => {
    post = cloneDeep(post);
    if (!hasResponse) {
      post.reactions[newReaction] += 1;
    } else {
      if (post.reactions[previousReaction] > 0) {
        post.reactions[previousReaction] -= 1;
      }
      if (previousReaction !== newReaction) {
        post.reactions[newReaction] += 1;
      }
    }
    return post;
  };

  const addNewReaction = (newReaction: any, hasResponse: any, previousReaction: any) => {
    const postReactions = filter(reactions, (reaction: any) => reaction?.postId !== post?._id);
    const newPostReaction = {
      avatarColor: profile?.avatarColor,
      createdAt: `${new Date()}`,
      postId: post?._id,
      profilePicture: profile?.profilePicture,
      username: profile?.username,
      type: newReaction
    };
    if (hasResponse && previousReaction !== newReaction) {
      postReactions.push(newPostReaction);
    } else if (!hasResponse) {
      postReactions.push(newPostReaction);
    }
    return postReactions;
  };

  const sendSocketIOReactions = (post: any, reaction: any, hasResponse: any, previousReaction: any) => {
    const socketReactionData = {
      userTo: post.userId,
      postId: post._id,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      type: reaction,
      postReactions: post.reactions,
      profilePicture: profile?.profilePicture,
      previousReaction: hasResponse ? previousReaction : ''
    };
    socketService.socket?.emit('reaction', socketReactionData);
  };

  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block" onClick={() => addReactionPost('like')}>
          <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
            <div className={`reaction-display ${userSelectedReaction.toLowerCase()} `} data-testid="selected-reaction">
              <img
                className="reaction-img"
                src={reactionsMap[userSelectedReaction.toLowerCase() as keyof ReactObject]}
                alt=""
              />
              <span>{userSelectedReaction}</span>
            </div>
          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions handleClick={addReactionPost} />
        </div>
      </div>
      <div className="comment-block" onClick={toggleCommentInput}>
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
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

export default CommentArea;
