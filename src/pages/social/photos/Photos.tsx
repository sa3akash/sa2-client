import React, { useState } from 'react';

import '@pages/social/photos/photo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { postService } from '@services/api/post/post.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';
import { followerService } from '@services/api/followers/followers.services';
import { PostUtils } from '@services/utils/Post.utils';
import useEffectOnce from '@hooks/useEffectOnce';
import ImageModal from '@components/image-modal/ImageModal';
import GalleryImage from '@components/GalleryImage/GalleryImage';

const Photos = () => {
  const { profile } = useSelector((state: RootState) => state.user);

  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rightImageIndex, setRightImageIndex] = useState<any>(0);
  const [leftImageIndex, setLeftImageIndex] = useState<any>(0);
  const [lastItemRight, setLastItemRight] = useState(false);
  const [lastItemLeft, setLastItemLeft] = useState(false);
  const dispatch = useDispatch();

  const getPostsWithImages = async () => {
    try {
      const response: any = await postService.getPostsWithImages(1);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const postImageUrl = (post: any) => {
    const imgUrl = Utils.getImage(post?.imgId, post?.imgVersion);
    return post?.gifUrl ? post?.gifUrl : imgUrl;
  };

  const emptyPost = (post: any) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, following)
    );
  };

  const displayImage = (post: any) => {
    const imgUrl = post?.gifUrl ? post?.gifUrl : Utils.getImage(post?.imgId, post?.imgVersion);
    setImageUrl(imgUrl);
  };

  const onClickRight = () => {
    setLastItemLeft(false);
    setRightImageIndex((index: any) => index + 1);
    const lastImage = posts[posts.length - 1];
    const post = posts[rightImageIndex];
    displayImage(post);
    setLeftImageIndex(rightImageIndex);
    if (posts[rightImageIndex] === lastImage) {
      setLastItemRight(true);
    }
  };

  const onClickLeft = () => {
    setLastItemRight(false);
    setLeftImageIndex((index: any) => index - 1);
    const firstImage = posts[0];
    const post = posts[leftImageIndex - 1];
    displayImage(post);
    setRightImageIndex(leftImageIndex);
    if (firstImage === post) {
      setLastItemLeft(true);
    }
  };

  useEffectOnce(() => {
    getPostsWithImages();
    getUserFollowing();
  });

  return (
    <>
      <div className="photos-container">
        {showImageModal && (
          <ImageModal
            image={`${imageUrl}`}
            showArrow={true}
            onClickRight={() => onClickRight()}
            onClickLeft={() => onClickLeft()}
            lastItemLeft={lastItemLeft}
            lastItemRight={lastItemRight}
            onCancel={() => {
              setRightImageIndex(0);
              setLeftImageIndex(0);
              setLastItemRight(false);
              setLastItemLeft(false);
              setShowImageModal(!showImageModal);
              setImageUrl('');
            }}
          />
        )}

        <div className="photos">Photos</div>

        {posts.length > 0 && (
          <div className="gallery-images">
            {posts.map((post: any, index: number) => (
              <div key={index} className={`${!emptyPost(post) ? 'empty-post-div' : ''}`} data-testid="gallery-images">
                {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, following) && (
                      <>
                        <GalleryImage
                          post={post}
                          showCaption={true}
                          showDelete={false}
                          imgSrc={`${postImageUrl(post)}`}
                          onClick={() => {
                            setRightImageIndex(index + 1);
                            setLeftImageIndex(index);
                            setLastItemLeft(index === 0);
                            setLastItemRight(index + 1 === posts.length);
                            setImageUrl(postImageUrl(post));
                            setShowImageModal(!showImageModal);
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            There are no photos to display
          </div>
        )}
      </div>
    </>
  );
};

export default Photos;
