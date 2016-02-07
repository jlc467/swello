import React from 'react';

const Error = (_props) =>
  <div style={{
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    margin: 0,
    marginTop: -275,
    width: '100%'
  }}
  >
    <h2>All of our servers are busy right now</h2>
    <h3>Please try again in a minute</h3>
  </div>;

export default Error;
