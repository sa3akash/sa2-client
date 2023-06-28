import { AxiosError } from 'axios';
import api from '@services/http';
import { AppDispatch } from '@store/index';
import { Utils } from '@services/utils/Utils.services';

class NotificationServices {
  async getUserNotification(dispatch: AppDispatch, setLoading: (arg: boolean) => void): Promise<any> {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      // dispatch(addToa(response?.data));
      return response.data.notifications;
    } catch (err) {
      if (err instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: err.response?.data.message });
      }
    } finally {
      setLoading(false);
    }
  }

  async markNotificationAsRead(notificationId: string, dispatch?: AppDispatch) {
    try {
      const response = await api.put(`/notification/${notificationId}`);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        dispatch && Utils.addNotification(dispatch, { type: 'error', description: err.response?.data.message });
      }
    }
  }

  async deleteNotification(dispatch: AppDispatch, notificationId: string) {
    try {
      const response = await api.delete(`/notification/${notificationId}`);
      Utils.addNotification(dispatch, { type: 'success', description: response.data?.message });
    } catch (err) {
      if (err instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: err.response?.data.message });
      }
    }
  }
}

export const notificationServices: NotificationServices = new NotificationServices();
