import { useRef, useState, useEffect } from 'react';
import '@pages/social/streams/stream.scss';

const Streams = () => {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);

  const PAGE_SIZE = 8;

  //   function fetchPostData() {
  //     let pageNum = currentPage;
  //     if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
  //       pageNum += 1;
  //       setCurrentPage(pageNum);
  //       getAllPosts();
  //     }
  //   }

  //   const getAllPosts = async () => {
  //     try {
  //       const response = await postService.getAllPosts(currentPage);
  //       if (response.data.posts.length > 0) {
  //         appPosts = [...posts, ...response.data.posts];
  //         const allPosts = uniqBy(appPosts, '_id');
  //         const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
  //         setPosts(orderedPosts);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  //     }
  //   };

  //   const getUserFollowing = async () => {
  //     try {
  //       const response = await followerService.getUserFollowing();
  //       setFollowing(response.data.following);
  //     } catch (error) {
  //       Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  //     }
  //   };

  //   const getReactionsByUsername = async () => {
  //     try {
  //       const response = await postService.getReactionsByUsername(storedUsername);
  //       dispatch(addReactions(response.data.reactions));
  //     } catch (error) {
  //       Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  //     }
  //   };

  //   useEffectOnce(() => {
  //     getUserFollowing();
  //     getReactionsByUsername();
  //     deleteSelectedPostId();
  //     dispatch(getPosts());
  //     dispatch(getUserSuggestions());
  //   });

  //   useEffect(() => {
  //     setLoading(allPosts?.isLoading);
  //     const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
  //     setPosts(orderedPosts);
  //     setTotalPostsCount(allPosts?.totalPostsCount);
  //   }, [allPosts]);

  //   useEffect(() => {
  //     PostUtils.socketIOPost(posts, setPosts);
  //   }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          {/* <PostForm /> */}
          {/* <Posts allPosts={posts} postsLoading={loading} userFollowing={following} /> */}
          {/* <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div> */}
        </div>
        <div className="streams-suggestions">{/* <Suggestions /> */}</div>
      </div>
    </div>
  );
};

export default Streams;
