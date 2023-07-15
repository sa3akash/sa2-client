import Avatar from '@components/avatar/Avatar';
import '@components/posts/comments/comment-modal/commentModal.scss';
import ReactionWrapper from '@components/posts/model-wrappers/reactionWrapper/ReactionWrapper';
import useEffectOnce from '@hooks/useEffectOnce';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { RootState } from '@store/index';
import { closeModel } from '@store/reducer/model';
import { clearPost } from '@store/reducer/post';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CommentsModal = () => {
  const { post } = useSelector((state: RootState) => state);
  const [postComments, setPostComments] = useState([]);
  const dispatch = useDispatch();

  const getPostComments = async () => {
    try {
      const response: any = await postService.getPostComments(`${post?._id}`);
      setPostComments(response.data?.comments);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const closeCommentsModal = () => {
    dispatch(closeModel());
    dispatch(clearPost());
  };

  useEffectOnce(() => {
    getPostComments();
  });

  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments.map((data: any) => (
              <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
                <div className="modal-comments-container-list-item-display">
                  <div className="user-img">
                    <Avatar
                      name={data?.username}
                      bgColor={data?.avatarColor}
                      textColor="#ffffff"
                      size={45}
                      avatarSrc={data?.profilePicture}
                    />
                  </div>
                  <div className="modal-comments-container-list-item-display-block">
                    <div className="comment-data">
                      <h1>{data?.username}</h1>
                      <p>{data?.comment}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};
export default CommentsModal;
