import React, { Component } from 'react';
import MdClose from '../common/svg/close';
import css from './NameStarredItemModal.css';

class NameStarredItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
  }
  handleChange(e) {
    this.setState({ name: e.target.value });
  }
  addFavorite(e) {
    if (this.state.name.trim().length > 0) {
      e.preventDefault();
      this.props.addStarredItem(this.state.name.trim());
      this.props.toggleNameStarredItemModal();
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className={css.container}>
        <MdClose
          className={css.close}
          onClick={() => this.props.toggleNameStarredItemModal()}
          width="20" height="20"
        />
        <form onSubmit={this.addFavorite}>
        <input
          data-test="favorite-name-location-input"
          maxLength="50"
          required
          autoFocus
          pattern=".*\S.*"
          placeholder="enter location name"
          title="Enter a name for this location"
          className={css.nameInput}
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <button
          data-test="favorite-button-save"
          onClick={this.addFavorite}
          className={css.button}
        >
          Add
        </button>
        </form>
      </div>
    );
  }
}

export default NameStarredItemModal;
