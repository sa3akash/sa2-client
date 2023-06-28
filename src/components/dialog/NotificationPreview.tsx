import Button from '@components/button/Button';

import loveR from '@assets/reactions/love.png';
import angryR from '@assets/reactions/angry.png';
import hahaR from '@assets/reactions/haha.png';
import likeR from '@assets/reactions/like.png';
import sadR from '@assets/reactions/sad.png';
import wowR from '@assets/reactions/wow.png';

import '@components/dialog/dialogPrevies.scss';

interface NotificationPreviewProps {
  post: string;
  imgUrl: string;
  title: string;
  comment: string;
  reaction: string;
  senderName: string;
  secondButtonText: string;
  secondBtnHandler: () => void;
}

const NotificationPreview = ({
  title,
  post,
  imgUrl,
  comment,
  reaction,
  senderName,
  secondButtonText,
  secondBtnHandler
}: NotificationPreviewProps) => {
  return (
    <>
      <div className="notification-preview-container" data-testid="notification-preview">
        <div className="dialog">
          <h4>{title}</h4>
          <div className="dialog-body">
            {post && <span className="dialog-body-post">{post}</span>}
            {imgUrl && <img className="dialog-body-img" src={imgUrl} alt="" />}
            {comment && <span className="dialog-body-comment">{comment}</span>}
            {reaction && (
              <div className="dialog-body-reaction" data-testid="reaction">
                <span className="dialog-body-reaction-text">{senderName} reacted on your post with</span>{' '}
                <img
                  className="reaction-img"
                  src={
                    reaction === 'angry'
                      ? angryR
                      : reaction === 'love'
                      ? loveR
                      : reaction === 'wow'
                      ? wowR
                      : reaction === 'sad'
                      ? sadR
                      : reaction === 'haha'
                      ? hahaR
                      : likeR
                  }
                  alt="reaction"
                />
              </div>
            )}
          </div>
          <div className="btn-container">
            <Button className="button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreview;
