import React, { Component, PropTypes } from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px'
  }
};

class Option extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render() {
    const { name } = this.props;
    return (
      <div style={styles.container}>
        <span>{name}</span>
      </div>
    );
  }
}

export default Option;
