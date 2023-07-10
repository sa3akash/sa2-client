import '@components/posts/model-wrappers/postWrapper/postWrapper.scss';

interface PostProps {
  children: any;
}

const PostWrapper = ({ children }: PostProps) => {
  return (
    <div className="modal-wrapper" data-testid="post-modal">
      {children[1]}
      {children[2]}
      {children[3]}
      <div className="modal-bg"></div>
    </div>
  );
};

export default PostWrapper;
