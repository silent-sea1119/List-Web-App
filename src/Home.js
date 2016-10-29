import React, { Component } from 'react';
import map from 'lodash/map';
import classnames from 'classnames';
import './Home.styles.scss';

class ListItemModel {
  constructor(text, isChecked) {
    this.text = text;
    this.isChecked = isChecked;
  }
}

class Home extends Component {

  state = {
    inputValue: '',
    listItems: []
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
    this.setState({ listItems: listItems });
  }

  render() {
    const { inputValue } = this.state;
    return (
      <form className="form"
            onSubmit={e => e.preventDefault()}>
        <input onChange={e => this.setState({ inputValue: e.target.value })}
               value={inputValue}
               className="input"
               placeholder="what do you need to do today?"
               autoFocus/>
        <button className="button"
                onClick={this.save.bind(this)}>Save</button>
        {this.renderList()}
      </form>
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
      <li key={i} className={classnames("listItem", item.isChecked && "strikethrough")}>
        {item.text}
        <input type="checkbox"
               className="checkbox"
               checked={item.isChecked}
               onChange={() => this.toggleItem(i)} />
      </li>
    );
  }
}

export default Home;
