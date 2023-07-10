import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import '@components/posts/post-model/select-dropdown/selectDropdown.scss';
import { updatePostItem } from '@store/reducer/post';

interface SelectDropdownProps {
  isActive: boolean;
  setSelectedItem: (arg: ItemDoc) => void;
  items?: ItemDoc[];
}

const SelectDropdown = ({ isActive, setSelectedItem, items = [] }: SelectDropdownProps) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const selectItem = (item: ItemDoc) => {
    setSelectedItem(item);
    dispatch(updatePostItem({ privacy: item.topText }));
  };

  return (
    <div className="menu-container" data-testid="menu-container">
      <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
        <ul>
          {items.map((item: ItemDoc, index: number) => (
            <li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export interface ItemDoc {
  icon: JSX.Element;
  subText: string;
  topText: string;
}

export default SelectDropdown;
