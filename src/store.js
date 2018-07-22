import { applyMiddleware, compose as defaultCompose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import sagas from './sagas'

export const sagaMiddleware = createSagaMiddleware()

// eslint-disable-next-line no-underscore-dangle
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || defaultCompose

const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware)))

let sagaTask = sagaMiddleware.run(sagas)

if (module.hot) {
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('./reducers')
    store.replaceReducer(nextRootReducer)
  })
  module.hot.accept('./sagas', () => {
    // eslint-disable-next-line global-require
    const newSagas = require('./sagas').default
    sagaTask.cancel()
    sagaTask.done.then(() => {
      sagaTask = sagaMiddleware.run(newSagas)
    })
  })
}

export default store
