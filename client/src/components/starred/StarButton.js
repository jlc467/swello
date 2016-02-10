import React from 'react';
import TiStarOutline from '../common/svg/star-outline';
import css from './StarButton.css';
import NameStarredItemModal from './NameStarredItemModal';

const StarButton = (props) => {
  let button = null;
  if (props.isStarred) {
    button = (
      <div style={{ display: 'inline-block' }}>
        <button
          onClick={props.removeStarredItem}
          className={`${css.star} ${css.removeStar}`}
        >
          <TiStarOutline fill="#E1E0C0" width="20" height="20" />
          <span className={css.text}>
            Remove From Favorites
          </span>
        </button>
      </div>
    );
  } else {
    button = (
      <div style={{ display: 'inline-block' }}>
        <button
          data-test="favorite-button"
          onClick={props.toggleNameStarredItemModal}
          className={css.star}
        >
          <TiStarOutline width="20" height="20" />
          <span className={css.text}>
            Add To Favorites
          </span>
        </button>
        {props.showNameStarredItemModal
          ? <NameStarredItemModal
            addStarredItem={props.addStarredItem}
            toggleNameStarredItemModal={props.toggleNameStarredItemModal}
          />
          : null
        }
      </div>
    );
  }
  return button;
};

export default StarButton;
