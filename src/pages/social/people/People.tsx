import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@pages/social/people/people.scss';
import { FaCircle } from 'react-icons/fa';
import { Utils } from '@services/utils/Utils.services';
import Avatar from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@store/index';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { userService } from '@services/api/users/user.services';
import { uniqBy } from 'lodash';
import { AxiosError } from 'axios';
import useEffectOnce from '@hooks/useEffectOnce';
import CardElementButtons from '@components/cart-eliments/CardElementButtons';
import CardElementStats from '@components/cart-eliments/CardElementStats';
import { ProfileUtils } from '@services/utils/Profile.services';
import { socketService } from '@services/sockets/socket.services';
import { FollowersUtils } from '@services/utils/followers.utils';
import { followerService } from '@services/api/followers/followers.services';

const People = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<any>([]);
  const [following, setFollowing] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);

  const PAGE_SIZE = 12;

  function fetchData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  const getAllUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers(currentPage);
      if (response.data.users.length > 0) {
        setUsers((data: any) => uniqBy([...data, ...response.data.users], '_id'));
      }
      setTotalUsersCount(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  }, [currentPage, dispatch]);

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  useEffectOnce(() => {
    getAllUsers();
    getUserFollowing();
  });

  const followUser = (user: any) => {
    try {
      FollowersUtils.followUser(user, dispatch);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const unFollowUser = (user: any) => {
    try {
      const userData = user;
      userData.followersCount -= 1;
      socketService?.socket?.emit('unfollow', userData);
      FollowersUtils.unFollowUser(user, profile, dispatch);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  useEffect(() => {
    FollowersUtils.socketIOFollowAndUnfollow(users, following, setFollowing, setUsers);
    // ChatUtils.usersOnline(setOnlineUsers);
  }, [following, users]);

  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users.length > 0 && (
        <div className="card-element">
          {users.map((data: any, i: number) => (
            <div className="card-element-item" key={i} data-testid="card-element-item">
              {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
                <div className="card-element-item-indicator">
                  <FaCircle className="online-indicator" />
                </div>
              )}
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
                isChecked={Utils.checkIfUserIsFollowed(following, data?._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => followUser(data)}
                onClickBtnTwo={() => unFollowUser(data)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
              />
            </div>
          ))}
        </div>
      )}

      {loading && !users.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !users.length && (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      )}

      <div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};

export default People;
