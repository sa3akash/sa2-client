import React, { useRef, useState } from 'react';
import '@components/posts/postForm/postForm.scss';
import Avatar from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store/index';
import Input from '@components/input/Input';
import photoImg from '@assets/images/photo.png';
import gifImg from '@assets/images/gif.png';
import feelingImg from '@assets/images/feeling.png';
import { openModel, toggleFeelingModal, toggleGifModal, toggleImageModal } from '@store/reducer/model';
import AddPost from '../post-model/addPost/AddPost';
import { ImageUtils } from '@services/utils/image.utils';
import EditPost from '../post-model/edit-post/EditPost';

const PostForm = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { type, isOpen, openFileDialog, gifModalIsOpen, feelingsIsOpen } = useSelector(
    (state: RootState) => state.model
  );

  const dispatch: AppDispatch = useDispatch();

  const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null);

  const openPostModel = () => {
    dispatch(openModel({ type: 'add' }));
  };

  const fileInputRef = useRef<any>(null);

  const openImageModal = () => {
    fileInputRef.current?.click();
    dispatch(openModel({ type: 'add' }));
    dispatch(toggleImageModal(!openFileDialog));
  };

  // const openVideoModal = () => {
  //   videoInputRef.current.click();
  //   dispatch(openModal({ type: 'add' }));
  //   dispatch(toggleVideoModal(!openVideoDialog));
  // };

  const openGifModal = () => {
    dispatch(openModel({ type: 'add' }));
    dispatch(toggleGifModal(!gifModalIsOpen));
  };

  const openFeelingsComponent = () => {
    dispatch(openModel({ type: 'add' }));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVideo = event.target as HTMLInputElement;
    if (!inputVideo.files?.length) {
      return;
    }
    const file = inputVideo.files[0];

    ImageUtils.addFileToRedux(file, '', setSelectedPostImage, dispatch, 'image');
  };

  return (
    <>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div className="post-form-input-body" data-testid="input-body" onClick={openPostModel}>
              <Avatar
                name={`${profile?.username}`}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div className="post-form-input" data-placeholder="Write something here..."></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
              <li className="post-form-list-item image-select" onClick={openImageModal}>
                <Input
                  name="image"
                  type="file"
                  ref={fileInputRef}
                  className="file-input"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  handleChange={handleImageFileChange}
                />
                <img loading="lazy" src={photoImg} alt="photo" /> Photo
              </li>
              <li className="post-form-list-item" onClick={openGifModal}>
                <img loading="lazy" src={gifImg} alt="gif" /> Gif
              </li>
              <li className="post-form-list-item" onClick={openFeelingsComponent}>
                <img loading="lazy" src={feelingImg} alt="feeling" /> Feeling
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isOpen && type === 'add' && <AddPost selectedImage={selectedPostImage} />}
      {isOpen && type === 'edit' && <EditPost />}
    </>
  );
};

export default PostForm;
