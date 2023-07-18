import { useRef, useState, useEffect } from 'react';
import '@pages/social/streams/stream.scss';
import Suggestions from '@components/suggestions/Suggestions';
import useEffectOnce from '@hooks/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import PostForm from '@components/posts/postForm/PostForm';
import Posts from '@components/posts/Posts';
import { postService } from '@services/api/post/post.services';
import { orderBy, uniqBy } from 'lodash';
import { AxiosError } from 'axios';
import { Utils } from '@services/utils/Utils.services';
import { getPosts } from '@store/api';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { PostUtils } from '@services/utils/Post.utils';
import { addReactions } from '@store/reducer/userPostReaction';
import useLocalStorage from '@hooks/useLocalStorage';
import useScrollContainer from '@hooks/useScroll';
import { followerService } from '@services/api/followers/followers.services';

const Streams = () => {
  const allPosts = useSelector((state: RootState) => state.allPosts);

  const [posts, setPosts] = useState<any>([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const bodyRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  const appPosts = useRef<any>();

  // useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  useScrollContainer(bodyRef, fetchPostData);

  const PAGE_SIZE = 11;

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.ceil(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      const response: any = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        appPosts.current = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts.current, '_id');
        const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(orderedPosts);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response: any = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data?.reactions));
    } catch (error) {
      if (error instanceof AxiosError) {
        Utils.addNotification(dispatch, { type: 'error', description: error.response?.data.message });
      }
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    deleteSelectedPostId();
    dispatch(getPosts());
    // dispatch(getUserSuggestions());
  });

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
    setPosts(orderedPosts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
