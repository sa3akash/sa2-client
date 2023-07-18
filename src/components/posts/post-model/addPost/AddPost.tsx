import Button from '@components/button/Button';
import PostWrapper from '@components/posts/model-wrappers/postWrapper/PostWrapper';
import { RootState } from '@store/index';
import { closeModel, toggleGifModal } from '@store/reducer/model';
import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import '@components/posts/post-model/addPost/addPost.scss';
import ModalBoxContent from '../post-model-box/PostModelBox';
import { bgColors } from '@services/utils/Static.data';
import ModalBoxSelection from '../post-model-box/PostModelSelection';
import { PostUtils } from '@services/utils/Post.utils';
import Giphy from '@components/giffy/Giffy';
import { postService } from '@services/api/post/post.services';
import { ImageUtils } from '@services/utils/image.utils';
import { AxiosError } from 'axios';

interface AddPostProps {
  selectedImage?: File | null | undefined;
  selectedPostVideo?: File | null | undefined;
}

interface PostDataDoc {
  post: string;
  bgColor: string;
  privacy: string;
  feelings: string;
  gifUrl: string;
  profilePicture: string;
  image: string | unknown | undefined;
  video: string;
}

const AddPost = ({ selectedImage }: AddPostProps) => {
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.model);
  const { gifUrl, image, privacy } = useSelector((state: RootState) => state.post);

  const { profile } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
  const [postData, setPostData] = useState<PostDataDoc>({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    video: ''
  });

  const [disable, setDisable] = useState(true);

  const [apiResponse, setApiResponse] = useState('');
  const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const counterRef = useRef<any>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const imageInputRef = useRef<HTMLDivElement | null>(null);

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
    PostUtils.clearImage(postData, '', inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };

  //
  //  create a new post
  //

  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling.name;
      }
      postData.privacy = privacy || 'Public';
      postData.gifUrl = gifUrl || '';
      postData.profilePicture = profile?.profilePicture || '';

      if (selectedPostImage || selectedImage) {
        let result;
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }

        if (selectedImage) {
          result = await ImageUtils.readAsBase64(selectedImage);
        }
        // if (selectedVideo) {
        //   result = await ImageUtils.readAsBase64(selectedVideo);
        // }

        // if (selectedPostVideo) {
        //   result = await ImageUtils.readAsBase64(selectedPostVideo);
        // }

        const type = selectedPostImage || selectedImage ? 'image' : 'video';
        if (type === 'image') {
          postData.image = result;
          // postData.video = '';
        } else {
          // postData.video = result;
          postData.image = '';
        }
        const response: any = await PostUtils.sendPostWithFileRequest(
          type,
          postData,
          imageInputRef,
          setApiResponse,
          setLoading,
          dispatch
        );
        if (response && response.data?.message) {
          setHasVideo(false);

          PostUtils.closePostModal(dispatch);
        }
      } else {
        const response = await postService.createPost(postData);
        if (response) {
          setApiResponse('success');
          setLoading(false);
          setHasVideo(false);
          PostUtils.closePostModal(dispatch);
        }
      }
    } catch (error) {
      setHasVideo(false);
      if (error instanceof AxiosError) {
        PostUtils.dispatchNotification(error.response?.data.message, 'error', setApiResponse, dispatch);
      }
    } finally {
      setLoading(false);
    }
  };

  //
  //  create a new post
  //

  useEffect(() => {
    PostUtils.positionCursor('editable');
  }, []);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModel());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);

  // set post image
  useEffect(() => {
    if (gifUrl) {
      setPostImage(gifUrl);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    } else if (image) {
      setPostImage(image);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    }
  }, [gifUrl, image, postData]);

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{
              height:
                selectedPostImage || hasVideo || gifUrl || image || postData?.gifUrl || postData?.image
                  ? '700px'
                  : 'auto'
            }}
          >
            {loading && (
              <div className="modal-box-loading" data-testid="modal-box-loading">
                <span>Posting...</span>
                {/* <Spinner /> */}
              </div>
            )}
            <div className="modal-box-header">
              <h2>Create Post</h2>
              <button disabled={loading} className="modal-box-header-cancel" onClick={() => closePostModal()}>
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
                          inputRef.current?.focus();
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
                      style={{ marginTop: `${hasVideo ? '-40px' : ''}` }}
                      onClick={() => clearImage()}
                    >
                      <FaTimes />
                    </div>

                    {!hasVideo && (
                      <img data-testid="post-image" loading="lazy" className="post-image" src={`${postImage}`} alt="" />
                    )}

                    {hasVideo && (
                      <div style={{ marginTop: '-40px' }}>
                        <video width="100%" controls src="/video.mp4" />
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
              100/100
            </span>

            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} setSelectedVideo={setSelectedVideo} />

            <div className="modal-box-button" data-testid="post-button">
              <Button
                label="Create Post"
                className="post-button"
                disabled={disable || loading}
                handleClick={createPost}
              />
            </div>
          </div>
        )}
        {gifModalIsOpen && (
          <div className="modal-giphy" data-testid="modal-giphy">
            <div className="modal-giphy-header">
              <div onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))} style={{ cursor: 'pointer' }}>
                <FaArrowLeft />
              </div>
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

export default AddPost;
