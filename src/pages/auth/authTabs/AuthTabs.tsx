import React, { useEffect, useState } from 'react';
import '@pages/auth/authTabs/authTabs.scss';
import backgroundImage from '@assets/images/background.jpg';
import Login from '@pages/auth/login/Login';
import Register from '@pages/auth/signup/SignUp';

import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/Utils.services';

const AuthTabs: React.FC = () => {
  const [type, setType] = useState('Sign In');

  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState<string | undefined>('');
  const navigate = useNavigate();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) navigate('/social/streams');
  }, [keepLoggedIn, navigate]);

  return (
    <React.Fragment>
      <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="environment">{environment}</div>
        <div className="container-wrapper-auth">
          <div className="tabs">
            <div className="tabs-auth">
              <ul className="tab-group">
                <li className={`tab ${type !== 'Sign In' ? 'active' : ''}`} onClick={() => setType('Sign In')}>
                  <button className="login">Sign In</button>
                </li>
                <li className={`tab ${type !== 'Sign Up' ? 'active' : ''}`} onClick={() => setType('Sign Up')}>
                  <button className="signup">Sign Up</button>
                </li>
              </ul>
              {type === 'Sign In' && (
                <div className="tab-item">
                  <Login />
                </div>
              )}
              {type === 'Sign Up' && (
                <div className="tab-item">
                  <Register />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthTabs;
