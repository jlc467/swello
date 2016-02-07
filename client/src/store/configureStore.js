import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from '../reducers';

// Redux DevTools store enhancers
// import { devTools, persistState } from 'redux-devtools';

const loggerMiddleware = createLogger();

const finalCreateStore = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware)
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(reducer, initialState);
}
