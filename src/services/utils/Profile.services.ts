import { createSearchParams } from 'react-router-dom';

export class ProfileUtils {
  static navigateToProfile(data: any, navigate: (arg0: string) => void) {
    const url = `/social/profile/${data?.username}?${createSearchParams({ id: data?._id, uId: data?.uId })}`;
    navigate(url);
  }
}
