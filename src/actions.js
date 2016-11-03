import { SAVE_LIST_ITEMS, LOAD_LIST_ITEMS } from './constants';

export function saveListItems(listItems) {
  return (dispatch) => {
    localStorage.setItem('listItems', JSON.stringify(listItems));
    dispatch({ type: SAVE_LIST_ITEMS });
  };
}

export function loadListItems() {
  return (dispatch) => {
    const listItems = JSON.parse(localStorage.getItem('listItems'));
    dispatch({ type: LOAD_LIST_ITEMS, listItems });
  };
}
