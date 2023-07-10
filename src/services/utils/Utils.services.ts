import { floor, random, some } from 'lodash';
import { avatarColors } from '@services/utils/Static.data';
import { addProfile, clearProfile } from '@store/reducer/user.reducer';
import { AppDispatch } from '@store/index';
import { UserDoc } from '@store/reducer/interfaces';
import { clearNotification, setNotification } from '@store/reducer/notifications';
import { ToastDoc } from '@components/toast/Toast';
import { Dispatch, SetStateAction } from 'react';

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

  static dispatchUser(
    data: { token: string; user: UserDoc },
    pageReload: (arg: boolean) => void,
    dispatch: AppDispatch
  ) {
    pageReload(true);
    dispatch(addProfile({ token: data.token, profile: data.user }));
  }

  static clearStore(
    dispatch: AppDispatch,
    deleteStorageUsername: () => void,
    deleteSessionPageReload: () => void,
    setLoggedIn: (arg: boolean) => void
  ) {
    dispatch(clearProfile());
    dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }

  static addNotification(dispatch: AppDispatch, message: ToastDoc) {
    dispatch(setNotification(message));
  }

  static clearAllNotification(dispatch: AppDispatch) {
    dispatch(clearNotification());
  }

  static appEnvironment() {
    if (import.meta.env.VITE_ENVIRONTMENT === 'local') {
      return 'LOCAL';
    } else if (import.meta.env.VITE_ENVIRONTMENT === 'development') {
      return 'DEV';
    } else if (import.meta.env.VITE_ENVIRONTMENT === 'staging') {
      return 'STG';
    }
  }

  static mapSettingsDropdownItems(setSettings: (arg: any) => void) {
    const items: ItemProps[] = [];
    const item: ItemProps = {
      topText: 'My Profile',
      subText: 'View personal profile.'
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  static appImageUrl(version: string, id: string) {
    if (typeof version === 'string' && typeof id === 'string') {
      version = version.replace(/['"]+/g, '');
      id = id.replace(/['"]+/g, '');
    }
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/v${version}/${id}`;
  }

  static getVideo(videoId: any, videoVersion: any) {
    throw new Error('Method not implemented.');
  }
  static getImage(imgId: any, imgVersion: any): string {
    return imgId && imgVersion ? this.appImageUrl(imgVersion, imgId) : '';
  }

  static checkIfUserIsBlocked(blocked: any, userId: any) {
    return some(blocked, (id) => id === userId);
  }

  static checkIfUserIsFollowed(userFollowers: any, postCreatorId: any, userId: any) {
    return some(userFollowers, (user) => user._id === postCreatorId || postCreatorId === userId);
  }

  static checkIfUserIsOnline(username: any, onlineUsers: any) {
    return some(onlineUsers, (user) => user === username?.toLowerCase());
  }

  static firstLetterUpperCase(word: any) {
    if (!word) return '';
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }
}

interface ItemProps {
  topText: string;
  subText: string;
}
