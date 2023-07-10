import Avatar from '@components/avatar/Avatar';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { find } from 'lodash';
import '@components/posts/post/post.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useEffect, useState } from 'react';
import useLocalStorage from '@hooks/useLocalStorage';
import { feelingsList, privacyList } from '@services/utils/Static.data';
import { postService } from '@services/api/post/post.services';
import { openModel, toggleDeleteDialog } from '@store/reducer/model';
import { Utils } from '@services/utils/Utils.services';
import { clearPost, updatePostItem } from '@store/reducer/post';
import { AxiosError } from 'axios';
import { timeAgo } from '@services/utils/timeAgo.utils';

interface PostProps {
  post?: any;
  showIcons?: any;
}

const Post: React.FC<PostProps> = ({ post, showIcons }) => {
  const { _id } = useSelector((state: RootState) => state.post);
  const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } = useSelector(
    (state: RootState) => state.model
  );
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundImageColor, setBackgroundImageColor] = useState('');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const dispatch = useDispatch();

  const getFeeling = (name: string) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type: string) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const deletePost = async () => {
    try {
      const response: any = await postService.deletePost(`${_id}`);
      if (response) {
        Utils.addNotification(dispatch, { type: 'success', description: response.data.message });
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen, data: '' }));
        dispatch(clearPost());
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const openPostModal = () => {
    dispatch(openModel({ type: 'edit' }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen, data: '' }));
    dispatch(updatePostItem(post));
  };

  const getBackgroundImageColor = async (post: any) => {
    let imageUrl = '';
    if (post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = Utils.getImage(post.imgId, post.imgVersion);
    } else if (post?.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = post?.gifUrl;
    }
    // const bgColor = await ImageUtils.getBackgroundImageColor(imageUrl);
    // setBackgroundImageColor(bgColor);
  };

  useEffect(() => {
    getBackgroundImageColor(post);
  }, [post]);

  return (
    <>
      {/* {reactionsModalIsOpen && <ReactionsModal />}
      {commentsModalIsOpen && <CommentsModal />} */}
      {/* {showImageModal && (
        <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} />
      )} */}
      {/* {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen,data:''}));
            dispatch(clearPost());
          }}
        />
      )} */}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div className="inline-display" data-testid="inline-display">
                      is feeling <img className="feeling-icon" src={`${getFeeling(post?.feelings)}`} alt="feelingImg" />
                      <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt className="trash" onClick={openDeleteDialog} />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createdAt)} &middot; {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
              {post?.post && post?.bgColor === '#ffffff' && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== '#ffffff' && (
                <div
                  data-testid="user-post-with-bg"
                  className="user-post-with-bg"
                  style={{ backgroundColor: `${post?.bgColor}` }}
                >
                  {post?.post}
                </div>
              )}

              {post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                  onClick={() => {
                    setImageUrl(Utils.getImage(post.imgId, post.imgVersion));
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img
                    className="post-image"
                    style={{ objectFit: 'contain' }}
                    src={`${Utils.getImage(post.imgId, post.imgVersion)}`}
                    alt=""
                  />
                </div>
              )}

              {post?.videoId && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: '#000000' }}
                >
                  <video
                    width="100%"
                    height="600px"
                    autoPlay={true}
                    controls
                    src={`${Utils.getVideo(post.videoId, post.videoVersion)}`}
                  />
                </div>
              )}

              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                  onClick={() => {
                    setImageUrl(post?.gifUrl);
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img className="post-image" style={{ objectFit: 'contain' }} src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {(post?.reactions.length > 0 || post?.commentsCount > 0) && <hr />}
              {/* <PostCommentSection post={post} /> */}
            </div>
          </div>
          {/* {selectedPostId === post?._id && <CommentInputBox post={post} />} */}
        </div>
      </div>
    </>
  );
};
Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool
};
export default Post;
