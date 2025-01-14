import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import thunk from 'redux-thunk';


const sagaMiddleware = createSagaMiddleware();

const middleWares = [sagaMiddleware, thunk]
const enhancer = composeWithDevTools(applyMiddleware(...middleWares));

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
