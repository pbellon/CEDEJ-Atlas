// https://github.com/diegohaz/arc/wiki/Redux-modules
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { isDev, isBrowser } from 'config';
import middlewares from './middlewares';
import reducer from './reducer';
import sagas from './sagas';

const devtools = isDev && isBrowser && window.devToolsExtension
  ? window.devToolsExtension
  : () => fn => fn;

const configureStore = (initialState, services = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const enhancers = [
    applyMiddleware(
      ...middlewares,
      sagaMiddleware
    ),
    devtools(),
  ];

  const store = createStore(reducer, initialState, compose(...enhancers));

  sagaMiddleware.run(sagas, services);

  return store;
};

export default configureStore;
