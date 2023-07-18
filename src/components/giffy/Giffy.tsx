import Input from '@components/input/Input';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

import '@components/giffy/giffy.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { updatePostItem } from '@store/reducer/post';
import { toggleGifModal } from '@store/reducer/model';
import { GiphyUtils } from '@services/utils/giffy.utils';
import Spinner from '@components/spinner/Spinner';

const Giphy = () => {
  const { gifModalIsOpen } = useSelector((state: RootState) => state.model);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selectGif = (gif: any) => {
    dispatch(updatePostItem({ gifUrl: gif, image: '' }));
    dispatch(toggleGifModal(!gifModalIsOpen));
  };

  useEffect(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  }, []);

  return (
    <>
      <div className="giphy-container" id="editable" data-testid="giphy-container">
        <div className="giphy-container-picker" style={{ height: '500px' }}>
          <div className="giphy-container-picker-form">
            <FaSearch className="search" />
            <Input
              id="gif"
              name="gif"
              type="text"
              labelText=""
              placeholder="Search Gif"
              className="giphy-container-picker-form-input"
              handleChange={(e) => GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)}
            />
          </div>

          {loading && <Spinner />}

          <ul className="giphy-container-picker-list" data-testid="unorderedList">
            {gifs.map((gif: any, index) => (
              <li
                className="giphy-container-picker-list-item"
                data-testid="list-item"
                key={index}
                onClick={() => selectGif(gif.images.original.url)}
              >
                <img loading="lazy" style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
              </li>
            ))}
          </ul>

          {!gifs && !loading && (
            <ul className="giphy-container-picker-list">
              <li className="giphy-container-picker-list-no-item">No GIF found</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default Giphy;
