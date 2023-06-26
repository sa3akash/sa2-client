import SuggestionsSkeletons from '@components/suggestions/SuggestionsSkeleton';
import '@pages/social/streams/stream.scss';

const StreamsSkeleton = () => {
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post">
          {/* <PostFormSkeleton /> */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>{/* <PostSkeleton /> */}</div>
          ))}
        </div>
        <div className="streams-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
    </div>
  );
};

export default StreamsSkeleton;
