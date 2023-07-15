import api from '@services/http';
import { SinglePostDoc } from '@store/reducer/post';
import { ResponseType } from 'axios';

class PostService {
  async getAllPosts(page: number) {
    const response: ResponseType = await api.get(`/post/all/${page}`);
    return response;
  }

  async createPost(body: any) {
    const response: ResponseType = await api.post('/post', body);
    return response;
  }

  async createPostWithImage(body: any) {
    const response: ResponseType = await api.post('/post/image', body);
    return response;
  }

  async createPostWithVideo(body: any) {
    const response: ResponseType = await api.post('/post/video/post', body);
    return response;
  }

  async updatePostWithImage(postId: string, body: any) {
    const response: ResponseType = await api.put(`/post/image/${postId}`, body);
    return response;
  }

  async updatePostWithVideo(postId: string, body: any) {
    const response: ResponseType = await api.put(`/post/video/${postId}`, body);
    return response;
  }

  async updatePost(postId: string, body: any) {
    const response: ResponseType = await api.put(`/post/${postId}`, body);
    return response;
  }

  async getReactionsByUsername(username: string) {
    const response: ResponseType = await api.get(`/reactions/${username}`);
    return response;
  }

  async getPostReactions(postId: string) {
    const response: ResponseType = await api.get(`/reaction/${postId}`);
    return response;
  }

  async getSinglePostReactionByUsername(postId: string, username: string) {
    const response: ResponseType = await api.get(`/reaction/${postId}/${username}`);
    return response;
  }

  async getPostCommentsNames(postId: string) {
    const response: ResponseType = await api.get(`/post/comments-name/${postId}`);
    return response;
  }

  async getPostComments(postId: string) {
    const response: ResponseType = await api.get(`/post/comments/${postId}`);
    return response;
  }

  async getPostsWithImages(page: number) {
    const response: ResponseType = await api.get(`/post/images/${page}`);
    return response;
  }

  async getPostsWithVideos(page: number) {
    const response: ResponseType = await api.get(`/post/videos/${page}`);
    return response;
  }

  async addReaction(body: any) {
    const response: ResponseType = await api.post('/reaction/add', body);
    return response;
  }

  async removeReaction(postId: string, previousReaction: string, postReactions: any) {
    const body = {
      postId,
      previousReaction,
      postReactions
    };
    const response: ResponseType = await api.delete('/reaction/remove', { data: body });
    return response;
  }

  async addComment(body: any) {
    const response: ResponseType = await api.post('/post/comments', body);
    return response;
  }

  async deletePost(postId: string) {
    const response: ResponseType = await api.delete(`/post/${postId}`);
    return response;
  }
}

export const postService = new PostService();
