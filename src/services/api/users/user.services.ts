import api from '@services/http';
import { AppDispatch } from '@store/index';
import { addToSuggetion, setIsLoading } from '@store/reducer/suggetions';
import { AxiosError } from 'axios';

class UserService {
  async getUserSuggetions(dispatch: AppDispatch) {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get('user/profile/user/suggestions');
      dispatch(addToSuggetion(response?.data));
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data.message);
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  async logoutUser() {
    const response = await api.get('/signout');
    return response;
  }

  async checkCurrentUser() {
    const response = await api.get('/user/profile');
    return response;
  }
  async getAllUsers(page: number) {
    const response = await api.get(`/user/all/${page}`);
    return response;
  }

  async searchUsers(query: any) {
    const response = await api.get(`/user/profile/search/${query}`);
    return response;
  }

  async getUserProfileByUserId(userId: number) {
    const response = await api.get(`/user/profile/${userId}`);
    return response;
  }

  async getUserProfileByUsername(username: string, userId: number, uId: number) {
    const response = await api.get(`/user/profile/posts/${username}/${userId}/${uId}`);
    return response;
  }

  async changePassword(body: any) {
    const response = await api.put('/user/profile/change-password', body);
    return response;
  }

  async updateNotificationSettings(settings: any) {
    const response = await api.put('/user/profile/settings', settings);
    return response;
  }

  async updateBasicInfo(info: any) {
    const response = await api.put('/user/profile/basic-info', info);
    return response;
  }

  async updateSocialLinks(info: any) {
    const response = await api.put('/user/profile/social-links', info);
    return response;
  }
}

export const userService: UserService = new UserService();
