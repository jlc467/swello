import React from 'react';
import css from './FullPageHeader.css';
import StarButton from '../starred/StarButton';

const FullPageHeader = (props) => {
  let locationName = '';
  if (props.favorite) {
    locationName = props.favorite.text;
  } else {
    locationName = `${props.params.lat}, ${props.params.long}`;
  }
  return (
    <div className={css.header}>
      <StarButton
        isStarred={props.favorite ? true : false}
        addStarredItem={props.addStarredItem}
        removeStarredItem={props.removeStarredItem}
        showNameStarredItemModal={props.showNameStarredItemModal}
        toggleNameStarredItemModal={props.toggleNameStarredItemModal}
      />
      <div className={css.buttons}>
      <button
        onClick={props.toggleRadar}
        data-for="fullTip"
        data-tip="View Radar"
        className={css.button}
      >Radar</button>
      <button
        onClick={props.toggleDetailAll}
        data-for="fullTip"
        data-tip="Toggle Detail View"
        className={css.button}
      >
        Toggle Detail
      </button>
      </div>
      <h4 style={{ color: 'white' }}>
        7-Day Forecast for {locationName}
      </h4>
    </div>
  );
};

export default FullPageHeader;
