import { floor, random } from 'lodash';
import { avatarColors } from '@services/utils/Static.data';
import { addProfile, clearProfile } from '@store/reducer/user.reducer';
import { AppDispatch } from '@store/index';

export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(text: string, backgroundColor: string, foregroundColor = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    context!.fillStyle = backgroundColor;
    context!.fillRect(0, 0, canvas.width, canvas.height);
    // Draw text
    context!.font = 'normal 80px sans-serif';
    context!.fillStyle = foregroundColor;
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    context!.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

  static dispatchUser(data: any, pageReload: any, dispatch: AppDispatch) {
    pageReload(true);
    dispatch(addProfile({ token: data.token, profile: data.user }));
  }

  static clearStore(
    dispatch: AppDispatch,
    deleteStorageUsername: () => void,
    deleteSessionPageReload: () => void,
    setLoggedIn: any
  ) {
    dispatch(clearProfile());
    // dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }
}
