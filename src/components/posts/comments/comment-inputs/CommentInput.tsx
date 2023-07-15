import React from 'react';
import Input from '@components/input/Input';
import '@components/posts/comments/comment-inputs/commentInput.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';
import { RootState } from '@store/index';
import { socketService } from '@services/sockets/socket.services';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';

const CommentInputBox = ({ post }: { post: any }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>('');
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      post = cloneDeep(post);
      post.commentsCount += 1;
      const commentBody = {
        userTo: post?.userId,
        postId: post?._id,
        comment: comment.trim(),
        commentsCount: post.commentsCount,
        profilePicture: profile?.profilePicture
      };
      socketService.socket.emit('comment', commentBody);
      await postService.addComment(commentBody);
      setComment('');
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  useEffect(() => {
    if (commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <div className="comment-container" data-testid="comment-input">
      <form className="comment-form" onSubmit={submitComment}>
        <Input
          ref={commentInputRef}
          name="comment"
          type="text"
          value={comment}
          labelText=""
          className="comment-input"
          placeholder="Write a comment..."
          handleChange={(event) => setComment(event.target.value)}
        />
      </form>
    </div>
  );
};

export default CommentInputBox;
