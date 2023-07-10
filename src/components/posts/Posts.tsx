import '@components/posts/posts.scss';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '@store/index';
import Post from './post/Post';
import { Utils } from '@services/utils/Utils.services';
import { PostUtils } from '@services/utils/Post.utils';
import PostSkeleton from './post/PostSkeleton';

interface PostsProps {
  allPosts: any;
  userFollowing: any;
  postsLoading: boolean;
}

const Posts = ({ allPosts, userFollowing, postsLoading }: PostsProps) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, postsLoading, userFollowing]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading &&
        posts?.length > 0 &&
        posts.map((post: any, i) => (
          <div key={i} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={false} />
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
            {' '}
            <PostSkeleton />{' '}
          </div>
        ))}
    </div>
  );
};

export default Posts;
