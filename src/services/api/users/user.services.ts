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
        console.error(err.response!.data.message);
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
}

export const userService: UserService = new UserService();
