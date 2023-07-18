import api from '@services/http';

class FollowerService {
  async getUserFollowing() {
    const response = await api.get('/user/following');
    return response;
  }

  async getUserFollowers(userId: string) {
    const response = await api.get(`/user/followers/${userId}`);
    return response;
  }

  async followUser(followerId: string) {
    const response = await api.put(`/user/follow/${followerId}`);
    return response;
  }

  async unFollowUser(followeeId: string, followerId: string) {
    const response = await api.put(`/user/unfollow/${followeeId}`);
    return response;
  }

  async blockUser(followerId: string) {
    const response = await api.put(`/user/block/${followerId}`);
    return response;
  }

  async unblockUser(followerId: string) {
    const response = await api.put(`/user/unblock/${followerId}`);
    return response;
  }
}

export const followerService = new FollowerService();
