import React, { Component, PropTypes } from 'react';
import Option from './Option';
import map from 'lodash/map';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '410px',
    height: '520px',
    borderRadius: '3px',
    boxShadow: '0px 15px 35px rgba(50,50,93,0.1), 0px 5px 15px rgba(0,0,0,.07)'
  },
  scrollBox: {
    height: '250px',
    width: '100%',
    overflowY: 'auto'
  }
};

class Form extends Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  render() {
    const { options } = this.props;
    const optionList = map(options, (o, i) => <Option name={o} key={i}/>);
    return (
      <div style={styles.container}>
        <div style={styles.scrollBox}>
          {optionList}
        </div>
      </div>
    );
  }
}

export default Form;
