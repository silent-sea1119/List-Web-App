import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import classnames from 'classnames';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import './Home.styles.scss';

class ListItemModel {
  constructor(text, isChecked) {
    this.text = text;
    this.isChecked = isChecked;
  }
}

class Home extends Component {

  static propTypes = {
    initialListItems: PropTypes.arrayOf(ListItemModel).isRequired
  }

  state = {
    inputValue: '',
    listItems: [],
    showEmojiPicker: false
  }

  save() {
    const { inputValue, listItems } = this.state;
    const newItem = new ListItemModel(inputValue, false);

    if (!inputValue) {
      return;
    }

    this.setState({
      listItems: [newItem, ...listItems],
      inputValue: ''
    });
  }

  toggleItem(itemIndex) {
    const { listItems } = this.state;
    const item = listItems[itemIndex];
    item.isChecked = !item.isChecked;
    this.setState({ listItems });
  }

  saveItem(itemIndex, newText) {
    const { listItems } = this.state;
    const item = listItems[itemIndex];
    item.text = newText;
    this.setState({ listItems });
    this.refs.input.focus();
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
    const { item, onToggle, onSave } = this.props;
    const { inputValue } = this.state;
    return (
      <li className={classnames('listItem', item.isChecked && 'strikethrough')}>
        <form className="listItemForm"
              onSubmit={this.handleSave.bind(this)}>
          <input className="inputItem"
                 value={inputValue}
                 onChange={e => this.setState({ inputValue: e.target.value })}/>
          <input type="checkbox"
                 className="checkbox"
                 checked={item.isChecked}
                 onChange={onToggle}/>
          <button className="button" />
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
  }
)(Home);
