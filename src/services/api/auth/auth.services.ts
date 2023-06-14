import api from '../../http';
import { IResetPasswordData, ISignUpData, ISigninData } from './auth.interfaces';
import {ResponseType} from 'axios';

class AuthService {
  async signUp(body: ISignUpData) {
    const response:ResponseType = await api.post('/signup', body);
    return response;
  }
  async signIn(body: ISigninData) {
    const response:ResponseType = await api.post('/signin', body);
    return response;
  }
  async forgotPassword(email: string) {
    const response:ResponseType = await api.post('/forgot-password', { email });
    return response;
  }
  async resetPassword(token: string, body: IResetPasswordData) {
    const response:ResponseType = await api.post(`/reset-password/${token}`, body);
    return response;
  }
}

export const authService: AuthService = new AuthService();
