import React, { Component } from 'react';
import Form from './Form';
import data from './data.json';

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
};

class Home extends Component {
  render() {
    return (
      <div style={styles.container}>
        <Form options={data.options}/>
      </div>
    );
  }
}

export default Home;
