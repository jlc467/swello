import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import loader from './svg/radio.svg';
import css from './Image.css';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false
    };
  }
  componentDidMount() {
    this.destroyLoader();
    const imgTag = ReactDOM.findDOMNode(this.refs.img);
    const imgSrc = imgTag.getAttribute('src');
    this.img = new window.Image();
    this.img.onload = () => this.onImageLoad();
    this.img.onerror = () => this.onImageError();
    this.img.src = imgSrc;
  }
  componentWillUnmount() {
    this.destroyLoader();
  }
  onImageLoad() {
    this.destroyLoader();
    this.setState({ loaded: true, error: false });
  }
  onImageError() {
    this.destroyLoader();
    this.setState({ loaded: false, error: true });
  }
  destroyLoader() {
    if (!this.img) {
      return;
    }
    this.img.onload = () => { /* do nothing */ };
    this.img.onerror = () => { /* do nothing */ };
    delete this.img;
  }
  render() {
    if (this.state.error === true) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>All of our radars are busy right now</h2>
          <h3>We will look into it</h3>
        </div>
      );
    }
    const { className, ...props } = this.props;
    let rootClassName = className ? `${className} ${css.initial}` : css.initial;
    if (this.state.loaded) {
      rootClassName += ` ${css.loaded}`;
    }
    return (
      <div>
        {!this.state.loaded
          ? <img className={css.loader} src={loader}/>
          : null
        }
        <img ref="img" {...props} className={rootClassName} />
      </div>
    );
  }
}

export default Image;
