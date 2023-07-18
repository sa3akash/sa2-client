import React, { useCallback, useEffect, useState } from 'react';
import '@pages/social/followers/followers.scss';
import Avatar from '@components/avatar/Avatar';
import { FollowersUtils } from '@services/utils/followers.utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useNavigate } from 'react-router-dom';
import { followerService } from '@services/api/followers/followers.services';
import { Utils } from '@services/utils/Utils.services';
import { AxiosError } from 'axios';
import { socketService } from '@services/sockets/socket.services';
import CardElementStats from '@components/cart-eliments/CardElementStats';
import CardElementButtons from '@components/cart-eliments/CardElementButtons';
import { ProfileUtils } from '@services/utils/Profile.services';

const Followers = () => {
  const { profile, token } = useSelector((state: RootState) => state.user);
  const [followers, setFollowers] = useState<any>([]);
  const [blockedUsers, setBlockedUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFollowers = useCallback(async () => {
    try {
      if (profile) {
        const response = await followerService.getUserFollowers(profile?._id);
        setFollowers(response.data.followers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  }, [profile, dispatch]);

  const blockUser = async (user: any) => {
    try {
      socketService?.socket?.emit('block-user', { blockedUser: user._id, blockedBy: profile?._id });
      FollowersUtils.blockUser(user, dispatch);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const unblockUser = async (user: any) => {
    try {
      socketService?.socket?.emit('unblock-user', { blockedUser: user._id, blockedBy: profile?._id });
      FollowersUtils.unblockUser(user, dispatch);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  useEffect(() => {
    getUserFollowers();
    setBlockedUsers(profile?.blocked);
  }, [getUserFollowers, profile]);

  useEffect(() => {
    FollowersUtils.socketIOBlockAndUnblock(profile, token, setBlockedUsers, dispatch);
  }, [dispatch, profile, token]);

  return (
    <div className="card-container">
      <div className="followers">Followers</div>
      {followers.length > 0 && (
        <div className="card-element">
          {followers.map((data: any) => (
            <div className="card-element-item" key={data?._id} data-testid="card-element-item">
              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar
                  name={data?.username}
                  bgColor={data?.avatarColor}
                  textColor="#ffffff"
                  size={120}
                  avatarSrc={data?.profilePicture}
                />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">{data?.username}</span>
                </div>
              </div>
              <CardElementStats
                postsCount={data?.postsCount}
                followersCount={data?.followersCount}
                followingCount={data?.followingCount}
              />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsBlocked(blockedUsers, data?._id)}
                btnTextOne="Block"
                btnTextTwo="Unblock"
                onClickBtnOne={() => blockUser(data)}
                onClickBtnTwo={() => unblockUser(data)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
              />
            </div>
          ))}
        </div>
      )}

      {loading && !followers.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !followers.length && (
        <div className="empty-page" data-testid="empty-page">
          You have no followers
        </div>
      )}

      <div style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};
export default Followers;
