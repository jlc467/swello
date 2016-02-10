import React from 'react';
import MdClose from '../common/svg/close';
import { Motion, spring, presets } from 'react-motion';
import StarredItemsContainer from './StarredItemsContainer';
import css from './StarredContainer.css';

const StarredContainer = (props) =>
  <Motion defaultStyle={{ right: -75 }} style={{ right: spring(0, presets.stiff) }}>
    {value => (
      <div data-test="favorites-sidebar" className={css.container} style={{ right: value.right }}>
        <MdClose className={css.close} onClick={ () => props.toggleStarred() }/>
      <div className={css.header}>Favorites</div>
      <StarredItemsContainer location={props.location} />
      </div>
    )}
  </Motion>;

export default StarredContainer;
