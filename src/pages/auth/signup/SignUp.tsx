import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@pages/auth/signup/signup.scss';
import { AxiosError, AxiosResponse } from 'axios';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/Utils.services';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { authService } from '@services/api/auth/auth.services';
import { useDispatch } from 'react-redux';
import useSessionStorage from '@hooks/useSessionStorage';

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const [signUp, setSignUp] = useState<SignUpData>({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUp((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const registerUser = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(signUp.username.charAt(0).toUpperCase(), avatarColor);
      const { data }: AxiosResponse<any, any> = (await authService.signUp({
        username: signUp.username,
        email: signUp.email,
        password: signUp.password,
        avatarColor,
        avatarImage
      })) as unknown as AxiosResponse<any, any>;

      setUser(data.user);
      setLoggedIn(true);
      setStoredUsername(signUp.username);

      navigate('/social/streams');
      setLoading(false);

      Utils.dispatchUser(data, pageReload, dispatch);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message);
      }
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
    }
  };

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}
      <form className="auth-form" onSubmit={registerUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={signUp.username}
            labelText="Username"
            placeholder="Enter Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={handleChange}
          />
          <Input
            id="email"
            name="email"
            type="text"
            value={signUp.email}
            labelText="Email"
            placeholder="Enter Email"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={handleChange}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={signUp.password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={handleChange}
          />
        </div>
        <Button
          label={`${loading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
          className="auth-button button"
          disabled={!signUp.username || !signUp.email || !signUp.password || loading}
        />
      </form>
    </div>
  );
};

Register.displayName = 'Register';

export default Register;
