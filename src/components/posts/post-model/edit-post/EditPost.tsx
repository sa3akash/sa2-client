import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/post-model/edit-post/editPost.scss';

import { FaArrowLeft, FaTimes } from 'react-icons/fa';

import Spinner from '@components/spinner/Spinner';
import { find } from 'lodash';
import { RootState } from '@store/index';
import { PostUtils } from '@services/utils/Post.utils';
import { bgColors, feelingsList } from '@services/utils/Static.data';
import { addPostFeeling, closeModel, toggleGifModal } from '@store/reducer/model';
import { Utils } from '@services/utils/Utils.services';
import { ImageUtils } from '@services/utils/image.utils';
import { AxiosError } from 'axios';
import PostWrapper from '@components/posts/model-wrappers/postWrapper/PostWrapper';
import ModalBoxContent from '../post-model-box/PostModelBox';
import ModalBoxSelection from '../post-model-box/PostModelSelection';
import Button from '@components/button/Button';
import Giphy from '@components/giffy/Giffy';

const EditPost = () => {
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.model);
  const { post } = useSelector((state: RootState) => state);
  const { profile } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>('');
  const [allowedNumberOfCharacters] = useState<string>('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState<string>('#ffffff');
  const [postData, setPostData] = useState({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    imgId: '',
    imgVersion: ''
  });
  const [disable, setDisable] = useState<boolean>(true);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const counterRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const imageInputRef = useRef<any>(null);

  const dispatch = useDispatch();

  const maxNumberOfCharacters = 100;

  const selectBackground = (bgColor: string) => {
    PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
  };

  const postInputEditable = (event: any, textContent: any) => {
    const currentTextLength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextLength;
    counterRef.current.textContent = `${counter}/100`;
    setDisable(currentTextLength <= 0 && !postImage);
    PostUtils.postInputEditable(textContent, postData, setPostData, setDisable);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const onKeyDown = (event: any) => {
    const currentTextLength = event.target.textContent.length;
    if (currentTextLength === maxNumberOfCharacters && event.keyCode !== 8) {
      event.preventDefault();
    }
  };

  const clearImage = () => {
    setSelectedVideo(null);
    setHasVideo(false);
    PostUtils.clearImage(postData, post?.post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };

  const getFeeling = useCallback(
    (name: string) => {
      const feeling = find(feelingsList, (data) => data.name === name);
      dispatch(addPostFeeling(feeling));
    },
    [dispatch]
  );

  const postInputData = useCallback(() => {
    setTimeout(() => {
      if (imageInputRef?.current) {
        postData.post = `${post.post}`;
        imageInputRef.current.textContent = post?.post;
        setPostData(postData);
      }
    });
  }, [post, postData]);

  const editableFields = useCallback(() => {
    if (post?.feelings) {
      getFeeling(post?.feelings);
    }

    if (post?.bgColor) {
      postData.bgColor = post?.bgColor;
      setPostData(postData);
      setTextAreaBackground(post?.bgColor);
      setTimeout(() => {
        if (inputRef?.current) {
          postData.post = `${post?.post}`;
          inputRef.current.textContent = post?.post;
          setPostData(postData);
        }
      });
    }

    if (post?.gifUrl && !post?.imgId) {
      postData.gifUrl = post?.gifUrl;
      postData.imgId = '';
      postData.imgVersion = '';
      postData.image = '';
      setPostImage(post?.gifUrl);
      setHasVideo(false);
      postInputData();
    }

    if (post?.imgId && !post?.gifUrl) {
      postData.imgId = post?.imgId;
      postData.imgVersion = `${post?.imgVersion}`;
      const imageUrl = Utils.getImage(post?.imgId, post?.imgVersion);
      setPostImage(imageUrl);
      setHasVideo(false);
      postInputData();
    }

    if (!post?.imgId && !post?.gifUrl) {
      postData.imgId = '';
      postData.imgVersion = '';
      postData.image = '';
      // const videoUrl = Utils.getVideo(post?.videoId, post?.videoVersion);
      // setHasVideo(true);
      postInputData();
    }
  }, [post, postData, getFeeling, postInputData]);

  const updatePost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      if (postData.gifUrl || (postData.imgId && postData.imgVersion)) {
        postData.bgColor = '#ffffff';
      }
      postData.privacy = post?.privacy || 'Public';
      postData.profilePicture = `${profile?.profilePicture}`;
      if (selectedPostImage || selectedVideo) {
        let result;
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }
        if (selectedVideo) {
          result = await ImageUtils.readAsBase64(selectedVideo);
        }
        const type = selectedPostImage ? 'image' : 'video';
        if (type === 'image') {
          postData.image = `${result}`;
        } else {
          postData.image = '';
          // postData.video = result;
        }
        postData.gifUrl = '';
        postData.imgId = '';
        postData.imgVersion = '';

        await PostUtils.sendUpdatePostWithFileRequest(type, post?._id, postData, setApiResponse, setLoading, dispatch);
      } else {
        setHasVideo(false);
        await PostUtils.sendUpdatePostRequest(post?._id, postData, setApiResponse, setLoading, dispatch);
      }
    } catch (error) {
      setHasVideo(false);
      if (error instanceof AxiosError) {
        PostUtils.dispatchNotification(error.response?.data.message, 'error', setApiResponse, dispatch);
      }
    }
  };

  useEffect(() => {
    PostUtils.positionCursor('editable');
  }, [post]);

  useEffect(() => {
    setTimeout(() => {
      if (imageInputRef?.current && imageInputRef?.current.textContent.length) {
        counterRef.current.textContent = `${maxNumberOfCharacters - imageInputRef?.current.textContent.length}/100`;
      } else if (inputRef?.current && inputRef?.current.textContent.length) {
        counterRef.current.textContent = `${maxNumberOfCharacters - inputRef?.current.textContent.length}/100`;
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModel());
    }
    // setDisable( post?.post && post?.post?.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, post, postImage]);

  useEffect(() => {
    if (post?.gifUrl) {
      postData.image = '';

      setSelectedPostImage(null);
      setSelectedVideo(null);
      setHasVideo(false);
      setPostImage(post?.gifUrl);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    } else if (post?.image) {
      setPostImage(post?.image);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    }
    // else if (post?.video) {

    //   // setPostImage(post?.video);
    //   setHasVideo(true);
    //   PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    // }
    editableFields();
  }, [editableFields, post, postData]);

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{
              height: selectedPostImage || hasVideo || post?.gifUrl || post?.imgId ? '700px' : 'auto'
            }}
          >
            {loading && (
              <div className="modal-box-loading" data-testid="modal-box-loading">
                <span>Updating post...</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2>Edit Post</h2>
              <button className="modal-box-header-cancel" onClick={() => closePostModal()}>
                X
              </button>
            </div>
            <hr />
            <ModalBoxContent />

            {!postImage && (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  style={{ background: `${textAreaBackground}` }}
                >
                  <div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
                    <div className="flex-row">
                      <div
                        data-testid="editable"
                        id="editable"
                        ref={(el) => {
                          inputRef.current = el;
                          inputRef?.current?.focus();
                        }}
                        className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${
                          postData.post.length === 0 && textAreaBackground !== '#ffffff' ? 'defaultInputTextColor' : ''
                        }`}
                        contentEditable={true}
                        onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                        onKeyDown={onKeyDown}
                        data-placeholder="What's on your mind?..."
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {postImage && (
              <>
                <div className="modal-box-image-form">
                  <div
                    data-testid="post-editable"
                    id="editable"
                    ref={(el) => {
                      imageInputRef.current = el;
                      imageInputRef?.current?.focus();
                    }}
                    className="post-input flex-item"
                    contentEditable={true}
                    onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                    onKeyDown={onKeyDown}
                    data-placeholder="What's on your mind?..."
                  ></div>
                  <div className="image-display">
                    <div
                      className="image-delete-btn"
                      data-testid="image-delete-btn"
                      style={{ marginTop: hasVideo ? '-40px' : '0px' }}
                      onClick={() => clearImage()}
                    >
                      <FaTimes />
                    </div>
                    {!hasVideo && (
                      <img loading="lazy" data-testid="post-image" className="post-image" src={`${postImage}`} alt="" />
                    )}
                    {hasVideo && (
                      <div style={{ marginTop: '-40px' }}>
                        <video width="100%" controls src={`${postImage}`} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((color, index) => (
                  <li
                    data-testid="bg-colors"
                    key={index}
                    className={`${color === '#ffffff' ? 'whiteColorBorder' : ''}`}
                    style={{ backgroundColor: `${color}` }}
                    onClick={() => {
                      PostUtils.positionCursor('editable');
                      selectBackground(color);
                    }}
                  ></li>
                ))}
              </ul>
            </div>
            <span className="char_count" data-testid="allowed-number" ref={counterRef}>
              {allowedNumberOfCharacters}
            </span>

            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} setSelectedVideo={setSelectedVideo} />

            <div className="modal-box-button" data-testid="edit-button">
              <Button label="Update" className="post-button" disabled={disable} handleClick={updatePost} />
            </div>
          </div>
        )}
        {gifModalIsOpen && (
          <div className="modal-giphy" data-testid="modal-giphy">
            <div className="modal-giphy-header">
              <span className="back-button" onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}>
                <FaArrowLeft />
              </span>
              <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
          </div>
        )}
      </PostWrapper>
    </>
  );
};

export default EditPost;
