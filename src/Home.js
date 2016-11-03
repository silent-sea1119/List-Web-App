import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import classnames from 'classnames';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import './Home.styles.scss';
import { saveListItems, loadListItems } from './actions';
import ListItemModel from './ListItemModel';
import moment from 'moment';
import FaCheck from 'react-icons/lib/fa/check';
import FaClose from 'react-icons/lib/fa/close';

let now = moment();

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
    const newItem = new ListItemModel(inputValue, false);
    if (!inputValue) return;
    this.setState({ inputValue: '' });
    this.updateListItems([newItem, ...listItems]);
  }

  toggleItem(itemIndex) {
    const { listItems } = this.state;
    const item = listItems[itemIndex];
    item.isChecked = !item.isChecked;
    this.updateListItems(listItems);
  }

  saveItem(itemIndex, newText) {
    const { listItems } = this.state;
    const item = listItems[itemIndex];
    item.text = newText;
    this.updateListItems(listItems);
    this.refs.input.focus();
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

  render() {
    const { inputValue } = this.state;
    return (
      <div>
        <form className="form"
              onSubmit={e => e.preventDefault()}>
          <input onChange={e => this.setState({ inputValue: e.target.value })}
                 ref="input"
                 value={inputValue}
                 className="input"
                 placeholder="what do you need to do today?"
                 autoFocus/>
          <button className="button"
                  onClick={this.save.bind(this)} />
        </form>
        {this.renderList()}
        <div className="lineContainer">
          <div className="line" />
        </div>
        <h2 className="date">{now.format('dddd, MMMM DD')}</h2>
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
    return (
      <ul className="list">
        {map(listItems, this.renderListItem.bind(this))}
      </ul>
    );
  }

  renderListItem(item, i) {
    return (
      <ListItem key={`${item.text}-${i}`}
                item={item}
                onToggle={() => this.toggleItem(i)}
                onSave={(newText) => this.saveItem(i, newText)} />
    );
  }
}

class ListItem extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    onToggle: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
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

  render() {
    const { item, onToggle, isChecked } = this.props;
    const { inputValue } = this.state;
    return (
      <li className={classnames('listItem', item.isChecked && 'strikethrough')}>
        <form className="listItemForm"
              onSubmit={this.handleSave.bind(this)}>
          <input className="inputItem"
                 value={inputValue}
                 onBlur={this.handleSave.bind(this)}
                 onChange={e => this.setState({ inputValue: e.target.value })}/>
          <div className="optionsContainer">
            <div className="innerCircleGreen" onClick={onToggle}>
              <FaCheck className={classnames('checkInactive', item.isChecked && 'checkActive')} />
            </div>
            <div className="innerCircleRed">
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
