import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Scannable.css';

class Scannable extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  static defaultProps = {};

  render() {
    const { children } = this.props;

    return <div className="Scannable">{children}</div>;
  }
}

export default Scannable;
