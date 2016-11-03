import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer';

const loggerMiddleware = createLogger();
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware);
export default createStore(reducer, middleware);
