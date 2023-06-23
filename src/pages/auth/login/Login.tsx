import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import '@pages/auth/login/login.scss';
import { FaArrowRight } from 'react-icons/fa';
import { authService } from '@services/api/auth/auth.services';
import { AxiosError, AxiosResponse } from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  // const [user, setUser] = useState();
  // const [setStoredUsername] = useLocalStorage('username', 'set');
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const loginUser = async (event: React.FormEvent): Promise<void> => {
    setLoading(true);
    event.preventDefault();
    try {
      const result: AxiosResponse<any, any> = (await authService.signIn({
        username: username,
        password: password
      })) as unknown as AxiosResponse<any, any>;
      setHasError(false);
      setAlertType('alert-success');
      console.log(result);
      navigate('/streams');
      setLoading(false);
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        setLoading(false);
        setHasError(true);
        setAlertType('alert-error');
        setErrorMessage(error.response!.data.message);
      }
    }
  };

  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeholder="Enter Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setUsername(event.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              value={keepLoggedIn}
              handleChange={() => setKeepLoggedIn(!keepLoggedIn)}
            />
            Keep me signed in
          </label>
        </div>
        <Button
          label={`${loading ? 'SIGNIN IN PROGRESS...' : 'SIGNIN'}`}
          className="auth-button button"
          disabled={!username || !password || loading}
        />

        <span className="forgot-password">
          <Link to={'/forgot-password'}>
            Forgot password?
            <FaArrowRight className="arrow-right" />
          </Link>
        </span>
      </form>
    </div>
  );
};

Login.displayName = 'Login';

export default Login;
