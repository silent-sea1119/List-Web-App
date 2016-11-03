import ListItemModel from './ListItemModel';
import map from 'lodash/map';
import concat from 'lodash/concat';

export default class ListItemState {
  constructor(listItems) {
    this.listItems = listItems || [];
  }

  concatListItems(listItems) {
    const mappedListItems = map(listItems, ({ text, isChecked }) => new ListItemModel(text, isChecked));
    return new ListItemState(concat(this.listItems, ...mappedListItems));
  }
}
