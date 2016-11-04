import ListItemModel from './ListItemModel';
import map from 'lodash/map';
import concat from 'lodash/concat';
import moment from 'moment';

export default class ListItemState {
  constructor(listItems) {
    this.listItems = listItems || [];
  }

  concatListItems(listItems) {
    const mappedListItems = map(listItems, ({ text, isChecked, timestamp, id }) => {
      return new ListItemModel(text, isChecked, moment(timestamp), id);
    });
    return new ListItemState(concat(this.listItems, ...mappedListItems));
  }
}
