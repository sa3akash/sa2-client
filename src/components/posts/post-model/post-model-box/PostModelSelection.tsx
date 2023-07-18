import React from 'react';
import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import feeling from '@assets/images/feeling.png';
import videoImg from '@assets/images/video.png';
import Input from '@components/input/Input';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { toggleGifModal } from '@store/reducer/model';
import Feelings from '@components/posts/post-model/feelings/Feelings';
import { ImageUtils } from '@services/utils/image.utils';

interface BoxProps {
  setSelectedPostImage: (arg: File) => void;
  setSelectedVideo: (arg: File) => void;
}

const ModalBoxSelection = ({ setSelectedPostImage, setSelectedVideo }: BoxProps) => {
  const { feelingsIsOpen, gifModalIsOpen } = useSelector((state: RootState) => state.model);
  const { post } = useSelector((state: RootState) => state.post);
  const feelingsRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(feelingsRef, feelingsIsOpen);
  const dispatch = useDispatch();

  const fileInputClicked = () => {
    fileInputRef.current?.click();
  };

  const videoInputClicked = () => {
    videoInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = event.target as HTMLInputElement;
    if (!inputFile.files?.length) {
      return;
    }
    const file = inputFile.files[0];

    ImageUtils.addFileToRedux(file, post, setSelectedPostImage, dispatch, 'image');
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVideo = event.target as HTMLInputElement;
    if (!inputVideo.files?.length) {
      return;
    }
    const file = inputVideo.files[0];

    ImageUtils.addFileToRedux(file, post, setSelectedVideo, dispatch, 'video');
  };

  return (
    <>
      {toggleFeelings && (
        <div ref={feelingsRef}>
          <Feelings setToggleFeelings={setToggleFeelings} />
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li className="post-form-list-item image-select" onClick={fileInputClicked}>
            <Input
              name="image"
              ref={fileInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              handleChange={handleFileChange}
            />
            <img loading="lazy" src={photo} alt="" /> Photo
          </li>
          <li className="post-form-list-item" onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}>
            <img loading="lazy" src={gif} alt="" /> Gif
          </li>
          <li className="post-form-list-item" onClick={() => setToggleFeelings(!toggleFeelings)}>
            <img loading="lazy" src={feeling} alt="" /> Feeling
          </li>
          <li className="post-form-list-item image-select" onClick={videoInputClicked}>
            <Input
              name="video"
              ref={videoInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                if (videoInputRef.current) {
                  videoInputRef.current.value = '';
                }
              }}
              handleChange={handleVideoFileChange}
            />
            <img loading="lazy" src={videoImg} alt="video" /> Video
          </li>
        </ul>
      </div>
    </>
  );
};

export default ModalBoxSelection;
