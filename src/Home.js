import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import find from 'lodash/find';
import remove from 'lodash/remove';
import toPairs from 'lodash/toPairs';

import classnames from 'classnames';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import moment from 'moment';
import FaCheck from 'react-icons/lib/fa/check';
import FaClose from 'react-icons/lib/fa/close';
import uuid from 'uuid';

import './Home.styles.scss';
import { saveListItems, loadListItems } from './actions';
import ListItemModel from './ListItemModel';

class Home extends Component {

  static propTypes = {
    initialListItems: PropTypes.arrayOf(PropTypes.instanceOf(ListItemModel)).isRequired,
    saveListItems: PropTypes.func.isRequired,
    loadListItems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    props.loadListItems();
    this.state = {
      inputValue: '',
      listItems: props.initialListItems,
      showEmojiPicker: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      listItems: nextProps.initialListItems
    });
  }

  save() {
    const { inputValue, listItems } = this.state;
    const now = moment();
    const newItem = new ListItemModel(inputValue, false, now, uuid.v4());
    if (!inputValue) return;
    this.setState({ inputValue: '' });
    this.updateListItems([newItem, ...listItems]);
  }

  toggleItem(itemID) {
    const { listItems } = this.state;
    const item = find(listItems, ({ id }) => id === itemID);
    item.isChecked = !item.isChecked;
    this.updateListItems(listItems);
  }

  saveItem(itemID, newText) {
    const { listItems } = this.state;
    const item = find(listItems, ({ id }) => id === itemID);
    item.text = newText;
    this.updateListItems(listItems);
    this.refs.input.focus();
  }

  deleteItem(itemID) {
    const { listItems } = this.state;
    remove(listItems, ({ id }) => id === itemID);
    this.updateListItems(listItems);
  }

  updateListItems(listItems) {
    this.setState({ listItems });
    this.props.saveListItems(listItems);
  }

  addEmoji(emoji) {
    const { inputValue } = this.state;
    this.setState({ inputValue: inputValue + emoji.native });
    this.refs.input.focus();
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.save();
    }
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div>
        <form className="form"
              onSubmit={e => e.preventDefault()}>
          <input onChange={e => this.setState({ inputValue: e.target.value })}
                 onKeyDown={this.handleKeyDown.bind(this)}
                 ref="input"
                 value={inputValue}
                 className="input"
                 placeholder="what do you need to do today?"
                 autoFocus/>
          <button className="button"
                  onClick={this.save.bind(this)} />
        </form>
        <div className="container">
          {this.renderList()}
        </div>
        <div className="emoji">
          <h1 className="emojiHeader">😃</h1>
          <div className="picker">
            <Picker emojiSize={24}
                    perLine={9}
                    skin={1}
                    set="apple"
                    color="#24b47e"
                    onClick={this.addEmoji.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }

  renderList() {
    const { listItems } = this.state;
    const groups = groupBy(listItems, item => item.timestamp.format('dddd, MMMM DD'));
    const pairs = toPairs(groups);
    return map(pairs, ([timestamp, group]) => {
      return (
        <div key={timestamp}>
          <h2 className="date">{timestamp}</h2>
          {this.renderGroup(group)}
        </div>
      );
    });
  }

  renderGroup(group) {
    return (
      <ul className="list">
        {map(group, this.renderListItem.bind(this))}
      </ul>
    );
  }

  renderListItem(item) {
    const id = item.id;
    return (
      <ListItem key={`${item.text}-${id}`}
                item={item}
                onToggle={() => this.toggleItem(id)}
                onSave={(newText) => this.saveItem(id, newText)}
                onDelete={() => this.deleteItem(id)} />
    );
  }
}

class ListItem extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    onToggle: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.item.text
    };
  }

  handleSave(e) {
    e.preventDefault();
    const { inputValue } = this.state;
    const { onSave } = this.props;
    onSave(inputValue);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSave(e);
    }
  }

  render() {
    const { item, onToggle, onDelete } = this.props;
    const { inputValue } = this.state;
    return (
      <li className={classnames('listItem', item.isChecked && 'strikethrough')}>
        <form className="listItemForm"
              onSubmit={this.handleSave.bind(this)}>
          <input className="inputItem"
                 value={inputValue}
                 onBlur={this.handleSave.bind(this)}
                 onChange={e => this.setState({ inputValue: e.target.value })}
                 onKeyPress={this.handleKeyDown.bind(this)} />
          <div className="optionsContainer">
            <div className="innerCircleGreen" onClick={onToggle}>
              <FaCheck className={classnames('checkInactive', item.isChecked && 'checkActive')} />
            </div>
            <div className="innerCircleRed" onClick={onDelete}>
              <FaClose className="deleteIcon" />
            </div>
          </div>
        </form>
      </li>
    );
  }
}

export default connect(
  (state) => {
    return {
      initialListItems: state.listItems
    };
  },
  (dispatch) => {
    return {
      saveListItems: (listItems) => dispatch(saveListItems(listItems)),
      loadListItems: () => dispatch(loadListItems())
    };
  }
)(Home);
