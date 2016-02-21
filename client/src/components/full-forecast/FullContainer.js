import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFullForecast, addStarredItem, removeStarredItem } from '../../actions';
import Day from './Day';
import CurrentDay from './CurrentDay';
import FullPageHeader from './FullPageHeader';
import Radar from '../common/Radar';
import css from './FullContainer.css';
import loader from '../common/svg/radio.svg';
import ReactTooltip from 'react-tooltip';
import { find } from 'lodash';

// Container for day-by-day weather forecast
class FullContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: {},
      isDetail: false,
      showNameStarredItemModal: false,
      favorite: null
    };
    this.getFullForecast = this.getFullForecast.bind(this);
  }
  componentWillMount() {
    this.getFullForecast(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname
      !== nextProps.location.pathname
    ) {
      this.getFullForecast(nextProps);
    }
  }
  getFullForecast(props) {
    if (props.location.pathname.indexOf('favorite') > -1) {
      const fav = find(props.starredItems, (o) => o.id.toString() === props.params.favoriteId);
      if (fav) {
        this.props.dispatch(
          getFullForecast({ lat: fav.lat, long: fav.long }, fav.zoneId)
        );
        this.setState({ favorite: fav });
        document.title = `${fav.text} | Swello`;
      } else {
        this.context.router.push({
          pathname: '/map',
          query: location.query
        });
      }
    } else {
      this.setState({ favorite: null });
      this.props.dispatch(
        getFullForecast(
          { lat: props.params.lat, long: props.params.long },
          props.params.zoneId
        )
      );
    }
  }
  // render each day as a collapse/expand Day panel component
  getDays() {
    if (this.props.forecast) {
      let advisory = null;
      if (this.props.marine
        && this.props.marine.advisory
        && this.props.marine.advisory.length
        > 0
      ) {
        advisory = this.props.marine.advisory;
      }
      return this.props.forecast.order.map((dIndex, i) => {
        const d = this.props.forecast[dIndex];
        let isOpen = false;
        if (typeof this.state.isOpen[dIndex] !== 'undefined') {
          isOpen = this.state.isOpen[dIndex];
        } else if (i === 0) {
          const bad = {};
          bad[dIndex] = true;
          this.setState({ isOpen: bad }); // naughty
          isOpen = true; // and on the first day the people rejoiced as there was great expansion
        }
        return (
          <Day
            offset={this.props.forecast.offset}
            dIndex={dIndex}
            key={`${d.time}fullDay`}
            isOpen={isOpen}
            toggle={(key) => this.toggleDetail(key) }
            temp={{ high: d.temperatureMax, low: d.temperatureMin }}
            wind={{ speed: d.windSpeed, bearing: d.windBearing }}
            precip={ d.precipProbability }
            icon={d.icon}
            summary={d.summary}
            time={d.time}
            marine={d.marine}
            advisory={advisory}
            hourly={d.hourly}
            loadingMarine={this.props.loadingMarine}
            marineError={this.props.marineError}
          />
        );
      });
    }
    return null;
  }
  // toggle expand / collapse of single Day
  toggleDetail(key) {
    const toMerge = {};
    toMerge[key] = !this.state.isOpen[key] ? true : !this.state.isOpen[key];
    this.setState({ isOpen: Object.assign({}, this.state.isOpen, toMerge) });
  }
  // toggle expand / collapse of all Days
  toggleDetailAll() {
    const toggleValue = !this.state.isDetail;
    const newIsOpen = this.props.forecast.order.reduce((toReturn, t) => {
      const newReturn = toReturn;
      newReturn[t] = toggleValue;
      return newReturn;
    }, {});
    this.setState({ isOpen: newIsOpen, isDetail: toggleValue });
  }
  // show/hide radar modal
  toggleRadar() {
    const { location } = this.props;
    if (location.query.showRadar === 'true') {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showRadar: 'false' })
      });
    } else {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showRadar: 'true' })
      });
    }
  }
  // show/hide NameStarredItemModal
  toggleNameStarredItemModal() {
    this.setState({ showNameStarredItemModal: !this.state.showNameStarredItemModal });
  }
  render() {
    let paddingRight = 0;
    if (this.props.location.query.showStarred === 'true' && this.props.starredEnabled === true) {
      paddingRight = 250;
    }

    if (this.props.loadingForecast === true) {
      return <div className={css.loader}><img src={loader}/></div>;
    }
    return (
      <div style={{ paddingRight }} className={css.container}>
        <ReactTooltip id="fullTip" effect="solid" place="bottom"/>
        <FullPageHeader
          favorite={this.state.favorite}
          addStarredItem={(locationName) =>
            this.props.dispatch(addStarredItem({
              text: locationName,
              lat: this.props.params.lat || this.state.favorite.lat,
              long: this.props.params.long || this.state.favorite.long,
              zoneId: this.props.params.zoneId || this.state.favorite.zoneId
            }, this.props.location.search))
          }
          removeStarredItem={() => this.props.dispatch(
            removeStarredItem(this.state.favorite, this.props.location.search)
          )}
          headerRef={this.headerRef}
          showNameStarredItemModal={this.state.showNameStarredItemModal}
          toggleNameStarredItemModal={() => this.toggleNameStarredItemModal()}
          goToMap={() => this.goToMap()}
          toggleRadar={() => this.toggleRadar()}
          params={this.props.params}
          toggleDetailAll={() => this.toggleDetailAll()}
        />
        {this.props.location.query.showRadar === 'true'
          ? <Radar
            toggleRadar={() => this.toggleRadar()}
            coords={{
              lat: this.props.params.lat || this.state.favorite.lat,
              long: this.props.params.long || this.state.favorite.long
            }}
          />
          : null
        }
        {this.props.forecast ? <CurrentDay
          temp={this.props.forecast.currently.temperature}
          wind={{
            speed: this.props.forecast.currently.windSpeed,
            bearing: this.props.forecast.currently.windBearing
          }}
          precip={ this.props.forecast.currently.precipProbability }
          icon={this.props.forecast.currently.icon}
          summary={this.props.forecast.currently.summary}
        /> : null}
        {this.getDays()}
      </div>
    );
  }
}

FullContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    forecast: state.appState.fullForecast,
    marine: state.appState.marine,
    loadingForecast: state.appState.loadingForecast,
    loadingMarine: state.appState.loadingMarine,
    marineError: state.appState.marineError,
    starredEnabled: state.appState.starredEnabled,
    starredItems: state.appState.starredItems
  };
}

export default connect(mapStateToProps)(FullContainer);
