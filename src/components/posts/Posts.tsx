import React, { useState, useEffect } from 'react';
import '@components/posts/posts.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import Post from '@components/posts/post/Post';
import { Utils } from '@services/utils/Utils.services';
import { PostUtils } from '@services/utils/Post.utils';
import PostSkeleton from '@components/posts/post/PostSkeleton';

interface PostsProps {
  allPosts: any;
  userFollowing: any;
  postsLoading: boolean;
}

const Posts: React.FC<PostsProps> = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading &&
        posts.length > 0 &&
        posts.map((post: any) => (
          <div key={post?._id} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={true} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      {loading &&
        !posts.length &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))}
    </div>
  );
};
export default Posts;
