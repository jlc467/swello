import React from 'react';
import TiRadar from '../common/svg/radar';
import MdSwapVert from '../common/svg/swap-vert';
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
      <div style={{ float: 'right' }}>
      <button
        onClick={props.toggleRadar}
        data-for="fullTip"
        data-tip="View Radar"
        className={css.button}
      ><TiRadar width="20" height="20" /></button>
      <button
        onClick={props.toggleDetailAll}
        data-for="fullTip"
        data-tip="Toggle Detail View"
        className={css.button}
      ><MdSwapVert width="20" height="20" /></button>
      </div>
      <h4 style={{ color: 'white' }}>
        7-Day Forecast for {locationName}
      </h4>
    </div>
  );
};

export default FullPageHeader;
