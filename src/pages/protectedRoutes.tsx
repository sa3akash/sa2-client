import React from 'react';
import useEffectOnce from '@hooks/useEffectOnce';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { userService } from '@services/api/users/user.services';
import { Utils } from '@services/utils/Utils.services';
import { RootState } from '@store/index';
import { addProfile } from '@store/reducer/user.reducer';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

interface ChildrenProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ChildrenProps> = ({ children }) => {
  // store
  const { profile, token } = useSelector((state: RootState) => state.user);
  //state
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const [userData, setUserData] = useState(null);
  // hooks
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const pageReload = useSessionStorage('pageReload', 'get');
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      //   dispatch(getConversationList());

      setUserData(response.data!.user);
      setTokenIsValid(true);
      dispatch(addProfile({ token: response.data!.token, profile: response.data.user }));
    } catch (error) {
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore(dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn);
        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [dispatch, navigate, deleteStorageUsername, deleteSessionPageReload, setLoggedIn]);

  useEffectOnce(() => {
    checkUser();
  });

  if (keepLoggedIn || (!keepLoggedIn && userData) || (profile && token) || pageReload) {
    if (!tokenIsValid) {
      return <></>;
    }

    return <>{children}</>;
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};

export default ProtectedRoute;
