import { handleActions } from 'redux-actions';
import { LOAD_LIST_ITEMS } from './constants';
import ListItemState from './ListItemState';

const initialState = new ListItemState();

export default handleActions({
  [LOAD_LIST_ITEMS]: (state, { listItems }) => {
    return state.concatListItems(listItems);
  }
}, initialState);
