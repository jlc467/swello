import React, { Component } from 'react';
import StarredItem from './StarredItem';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { moveCard, setStarred } from '../../actions';
import { compose } from 'redux';

class StarredItemsContainer extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.goToFavorite = this.goToFavorite.bind(this);
  }
  moveCard(dragIndex, hoverIndex) {
    const { cards, dispatch } = this.props;
    const dragCard = cards[dragIndex]; // get ref to card
    dispatch(moveCard(dragIndex, hoverIndex, dragCard));
  }
  endDrag() {
    this.props.dispatch(setStarred());
  }
  goToFavorite(id) {
    this.context.router.push({
      pathname: `/favorite/${id}`,
      search: this.props.location.search
    });
  }
  render() {
    const { cards } = this.props;
    return (
      <div style={{ marginTop: 20 }}>
        {cards.map((card, i) =>
          <StarredItem key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
            setStarred={this.endDrag}
            goToFavorite={this.goToFavorite}
          />
        )}
      </div>
    );
  }
}

StarredItemsContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    cards: state.appState.starredItems
  };
}

export default compose(
  DragDropContext(HTML5Backend),
  connect(mapStateToProps)
)(StarredItemsContainer);
