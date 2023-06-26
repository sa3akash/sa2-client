import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '@components/suggestions/suggestions.scss';
import { filter } from 'lodash';
import { AppDispatch, RootState } from '@store/index';
import useEffectOnce from '@hooks/useEffectOnce';
import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import { userService } from '@services/api/users/user.services';

const Suggestions = () => {
  const { users } = useSelector((state: RootState) => state.suggetionFriends);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const followUser = async (user: object) => {
    // try {
    //   FollowersUtils.followUser(user, dispatch);
    //   const result = filter(users, (data) => data?._id !== user?._id);
    //   setUsers(result);
    //   dispatch(addToSuggestions({ users: result, isLoading: false }));
    // } catch (error) {
    //   Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    // }
  };

  //   useEffect(() => {
  //     setUsers(suggestions?.users);
  //   }, [suggestions, users]);

  useEffectOnce(() => {
    // dispatch(getUserSuggestions());
    userService.getUserSuggetions(dispatch);
  });

  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={user?._id}>
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                  handleClick={() => followUser(user)}
                />
              </div>
            </div>
          ))}
        </div>
        {users.length > 8 && (
          <div className="view-more" onClick={() => navigate('/social/people')}>
            View More
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
