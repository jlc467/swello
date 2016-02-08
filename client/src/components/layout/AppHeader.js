import React from 'react';
import TiStarOutline from '../common/svg/star-outline';
import MdSearch from '../common/svg/search';
import logoUrl from '../common/svg/Swello2x.png';
import ReactTooltip from 'react-tooltip';
import css from './AppHeader.css';

const AppHeader = (props) =>
  <div className={css['app-header']}>
    <ReactTooltip id="headerTip" effect="solid" place="bottom"/>
    <span onClick={props.goToMap} className={css['app-header-title']}>
      <img height="37" width="112" src={logoUrl} />
    </span>
    <div className={css.center}>
      <button
        data-for="headerTip"
        data-tip="Find Forecast On Map"
        onClick={props.goToMap}
        className={css['app-header-button']}
      >
        <MdSearch style={{ position: 'relative', bottom: -1 }} width="35" height="35" />
      </button>
    </div>
    {props.starredEnabled ? <button
      style={{ position: 'absolute', top: 0, right: 0 }}
      data-for="headerTip"
      data-place="left"
      data-tip="Show / Hide Favorites"
      onClick={props.toggleStarred}
      className={css['app-header-button']}
    >
      <TiStarOutline style={{ position: 'relative', bottom: 0 }} width="35" height="35"/>
    </button> : null}
  </div>;

export default AppHeader;
