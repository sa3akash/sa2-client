import { FaArrowLeft } from 'react-icons/fa';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '@assets/images/background.jpg';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import '@pages/auth/forgotPassword/forgot.scss';
import { authService } from '@services/api/auth/auth.services';
import { AxiosError, AxiosResponse } from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const forgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log(email);

      const response: AxiosResponse<any, any> = (await authService.forgotPassword(email)) as unknown as AxiosResponse<
        any,
        any
      >;
      setLoading(false);
      setEmail('');
      setShowAlert(false);
      setAlertType('alert-success');
      setResponseMessage(response?.data?.message);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setResponseMessage(error?.response?.data?.message);
      }
      setAlertType('alert-error');
      setLoading(false);
      setShowAlert(true);
    }
  };

  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs forgot-password-tabs" style={{ height: `${responseMessage ? '300px' : ''}` }}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login forgot-password">Forgot Password</div>
              </li>
            </ul>

            <div className="tab-item">
              <div className="auth-inner">
                {responseMessage && (
                  <div className={`alerts ${alertType}`} role="alert">
                    {responseMessage}
                  </div>
                )}
                <form className="forgot-password-form" onSubmit={forgotPassword}>
                  <div className="form-input-container">
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      value={email}
                      labelText="Email"
                      placeholder="Enter Email"
                      style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                      handleChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    label={`${loading ? 'FORGOT PASSWORD IN PROGRESS...' : 'FORGOT PASSWORD'}`}
                    className="auth-button button"
                    disabled={!email}
                  />

                  <span className="login">
                    <Link to={'/'}>
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </Link>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
