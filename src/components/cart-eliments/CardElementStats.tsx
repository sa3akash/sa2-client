import { Utils } from '@services/utils/Utils.services';
import React from 'react';

interface CardElementStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

const CardElementStats: React.FC<CardElementStatsProps> = ({ postsCount, followersCount, followingCount }) => {
  return (
    <div className="card-element-stats">
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Posts</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {Utils.shortenLargeNumbers(postsCount)}
        </h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Followers</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {Utils.shortenLargeNumbers(followersCount)}
        </h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Following</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {Utils.shortenLargeNumbers(followingCount)}
        </h5>
      </div>
    </div>
  );
};

export default CardElementStats;
