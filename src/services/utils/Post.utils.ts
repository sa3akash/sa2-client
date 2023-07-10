import { closeModel } from '@store/reducer/model';
import { cloneDeep, find, findIndex, remove } from 'lodash';
import { AppDispatch } from '@store/index';
import { clearPost, updatePostItem } from '@store/reducer/post';
import { postService } from '@services/api/post/post.services';
import { AxiosError, AxiosResponse, ResponseType } from 'axios';
import { Utils } from './Utils.services';
import { socketService } from '@services/sockets/socket.services';

export class PostUtils {
  static selectBackground(bgColor: string, postData: any, setTextAreaBackground: any, setPostData: any) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable(textContent: any, postData: any, setPostData: any, setDisabled: any) {
    postData.post = textContent;
    setPostData(postData);
    setDisabled(false);
  }

  static closePostModal(dispatch: AppDispatch) {
    dispatch(closeModel());
    dispatch(clearPost());
  }

  static clearImage(
    postData: any,
    post: any,
    inputRef: any,
    dispatch: AppDispatch,
    setSelectedPostImage: any,
    setPostImage: any,
    setPostData: any
  ) {
    postData.gifUrl = '';
    postData.image = '';

    setSelectedPostImage(null);
    setPostImage('');
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor('editable');
    });
    dispatch(updatePostItem({ gifUrl: '', image: '', imgId: '', imgVersion: '' }));
  }

  static postInputData(imageInputRef: any, postData: any, post: any, setPostData: any) {
    setTimeout(() => {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  static dispatchNotification(message: string, type: any, setApiResponse: any, dispatch: AppDispatch) {
    setApiResponse(type);
    Utils.addNotification(dispatch, { type: type, description: message });
  }

  static async sendPostWithFileRequest(
    type: string,
    postData: any,
    imageInputRef: any,
    setApiResponse: (arg: string) => void,
    setLoading: (arg: boolean) => void,
    dispatch: AppDispatch
  ) {
    try {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      setLoading(true);
      const response =
        type === 'image'
          ? await postService.createPostWithImage(postData)
          : await postService.createPostWithVideo(postData);
      if (response) {
        setApiResponse('success');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        PostUtils.dispatchNotification(error.response?.data.message, 'error', setApiResponse, dispatch);
      }
    } finally {
      setLoading(false);
    }
  }

  static async sendUpdatePostWithFileRequest(
    type: any,
    postId: any,
    postData: any,
    setApiResponse: any,
    setLoading: any,
    dispatch: AppDispatch
  ) {
    try {
      setLoading(true);
      const response: any =
        type === 'image'
          ? await postService.updatePostWithImage(postId, postData)
          : await postService.updatePostWithVideo(postId, postData);

      if (response) {
        PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, dispatch);

        setTimeout(() => {
          setApiResponse('success');
        }, 3000);
        PostUtils.closePostModal(dispatch);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        PostUtils.dispatchNotification(error.response?.data.message, 'error', setApiResponse, dispatch);
      }
    } finally {
      setLoading(false);
    }
  }

  static async sendUpdatePostRequest(
    postId: any,
    postData: any,
    setApiResponse: any,
    setLoading: any,
    dispatch: AppDispatch
  ) {
    // const response = await postService.updatePost(postId, postData);
    // if (response) {
    //   PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, setLoading, dispatch);
    //   setTimeout(() => {
    //     setApiResponse('success');
    //     setLoading(false);
    //   }, 3000);
    //   PostUtils.closePostModal(dispatch);
    // }
  }

  static checkPrivacy(post: any, profile: any, following: any) {
    const isPrivate = post?.privacy === 'Private' && post?.userId === profile?._id;
    const isPublic = post?.privacy === 'Public';
    const isFollower =
      post?.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id);
    return isPrivate || isPublic || isFollower;
  }

  static positionCursor(elementId: string) {
    const element: HTMLElement | null = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection?.removeAllRanges();
    element && range.selectNodeContents(element);
    range.collapse(false);
    selection?.addRange(range);
    element?.focus();
  }

  static socketIOPost(posts: any, setPosts: (arg: any) => void) {
    posts = cloneDeep(posts);

    socketService?.socket?.on('add-post', (post) => {
      posts = [post, ...posts];
      setPosts(posts);
    });

    socketService?.socket?.on('update-post', (post) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });

    socketService?.socket?.on('delete-post', (postId) => {
      const index = findIndex(posts, (postData: any) => postData._id === postId);
      if (index > -1) {
        posts = cloneDeep(posts);
        remove(posts, { _id: postId });
        setPosts(posts);
      }
    });

    socketService?.socket?.on('update-like', (reactionData) => {
      const postData = find(posts, (post) => post._id === reactionData?.postId);
      if (postData) {
        postData.reactions = reactionData.postReactions;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

    socketService?.socket?.on('update-comment', (commentData) => {
      const postData = find(posts, (post) => post._id === commentData?.postId);
      if (postData) {
        postData.commentsCount = commentData.commentsCount;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });
  }

  static updateSinglePost(posts: any, post: any, setPosts: (arg: any) => void) {
    posts = cloneDeep(posts);
    const index = findIndex(posts, ['_id', post?._id]);
    if (index > -1) {
      posts.splice(index, 1, post);
      setPosts(posts);
    }
  }
}
