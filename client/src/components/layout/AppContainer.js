import React, { Component } from 'react';
import AppHeader from './AppHeader';
import StarredContainer from '../starred/StarredContainer';
import css from './AppContainer.css';
import { connect } from 'react-redux';
import Error from '../common/Error';

class AppContainer extends Component {
  constructor(props) {
    super(props);
  }
  getStarredSideBar() {
    if (this.props.location.query.showStarred === 'true' && this.props.starredEnabled === true) {
      return (
        <StarredContainer
          location={this.props.location}
          toggleStarred={() => {this.toggleStarred();}}
        />
      );
    }
    return null;
  }
  toggleStarred() {
    const { location } = this.props;
    if (location.query.showStarred === 'true') {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showStarred: 'false' })
      });
    } else {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showStarred: 'true' })
      });
    }
  }
  goToMap() {
    if (this.props.params && this.props.params.lat && this.props.params.long) {
      this.context.router.push({
        pathname: `/map/mini/` +
          `${this.props.params.lat}` +
          `/${this.props.params.long}` +
          `/${this.props.params.zoneId}`,
        search: this.props.location.search
      });
    } else if (this.props.params.favoriteId) {
      this.context.router.push({
        pathname: `/map/favorite/` +
          `${this.props.params.favoriteId}`,
        search: this.props.location.search
      });
    } else {
      this.context.router.push({
        pathname: `/map`,
        search: this.props.location.search
      });
    }
  }
  goToDrawMap() {
    this.context.router.push({
      pathname: `/drawmap`,
      search: this.props.location.search
    });
  }
  render() {
    if (this.props.error) {
      return <Error/>;
    }
    return (
      <div className={css.container}>
        <AppHeader
          goToMap={() => this.goToMap()}
          goToDrawMap={() => this.goToDrawMap()}
          starredEnabled={this.props.starredEnabled}
          toggleStarred={() => this.toggleStarred()}
        />
        {this.getStarredSideBar()}
        {this.props.children}
      </div>
    );
  }
}

AppContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    error: state.appState.error,
    starredEnabled: state.appState.starredEnabled
  };
}


export default connect(mapStateToProps)(AppContainer);
