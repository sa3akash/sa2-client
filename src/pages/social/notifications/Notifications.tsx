import React, { useState, useEffect } from 'react';
import Avatar from '@components/avatar/Avatar';
import '@pages/social/notifications/notifications.scss';
import { FaCircle, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import useEffectOnce from '@hooks/useEffectOnce';
import { notificationServices } from '@services/api/notification/notification.services';
import { NotificationUtils } from '@services/utils/Notification.utils';
import NotificationPreview from '@components/dialog/NotificationPreview';
import { timeAgo } from '@services/utils/timeAgo.utils';

const Notification = () => {
  const { profile } = useSelector((state: RootState) => state.user);

  const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationDialogContent, setNotificationDialogContent] = useState<NotificationDialogProps>({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });

  const [notificationCount, setNotificationCount] = useState(0);

  const dispatch = useDispatch();

  const getUserNotifications = async () => {
    const data = await notificationServices.getUserNotification(dispatch, setLoading);
    setNotifications(data);
  };

  const markAsRead = async (notification: NotificationDoc) => {
    NotificationUtils.markMessageAsRead(notification, dispatch, setNotificationDialogContent);
  };

  const deleteNotification = async (event: React.MouseEvent<HTMLElement>, notificatonId: string) => {
    event.stopPropagation();
    // deleteNotification
    await notificationServices.deleteNotification(dispatch, notificatonId);
  };

  useEffectOnce(() => {
    getUserNotifications();
  });

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      'notificationPage',
      setNotifications,
      setNotificationCount
    );
  }, [profile, notifications]);

  return (
    <>
      {notificationDialogContent?.senderName && (
        <NotificationPreview
          title="Your post"
          post={notificationDialogContent?.post}
          imgUrl={notificationDialogContent?.imgUrl}
          comment={notificationDialogContent?.comment}
          reaction={notificationDialogContent?.reaction}
          senderName={notificationDialogContent?.senderName}
          secondButtonText="Close"
          secondBtnHandler={() => {
            setNotificationDialogContent({
              post: '',
              imgUrl: '',
              comment: '',
              reaction: '',
              senderName: ''
            });
          }}
        />
      )}
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification) => (
              <div
                className="notification-box"
                data-testid="notification-box"
                key={notification?._id}
                onClick={() => markAsRead(notification)}
              >
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) => deleteNotification(event, notification?._id)}
                        >
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? <FaCircle className="icon" /> : <FaRegCircle className="icon" />}
                        </small>
                        <p className="subtext">{timeAgo.transform(notification?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && <div className="notifications-box"></div>}
        {!loading && !notifications.length && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};
export default Notification;

export interface NotificationDoc {
  comment: string;
  createdAt: string;
  createdItemId: string;
  entityId: string;
  gifUrl: string;
  imgId: string;
  imgVersion: string;
  imgUrl: string;
  message: string;
  notificationType: string;
  post: string;
  reaction: string;
  read: boolean;
  userFrom: UserFromDoc;
  userTo: string;
  _id: string;
  username?: string;
}

export interface UserFromDoc {
  avatarColor: string;
  profilePicture: string;
  uId: string;
  username: string;
}

export interface NotificationProps {
  _id: string;
  read: boolean;
  message: string;
  userFrom: UserFromDoc;
}

export interface NotificationDialogProps {
  post: string;
  imgUrl: string;
  comment: string;
  reaction: string;
  senderName: string;
}
