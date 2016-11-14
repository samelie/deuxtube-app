import './main.scss';

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';

import { syncHistoryWithStore } from 'react-router-redux';
import SOCKET from './utils/socket';
import Keys from './utils/keys';

import {
  KEYBOARD_UP,
  KEYBOARD_DOWN,
  RESIZE,
  ORIENTATION_CHANGE,
  MOUSE_MOVE,
  EFFECTS_UPDATE_SELECTED,
} from './constants/action-types';

import configureStore from './store/configure-store';
import configureRoutes from './routes/configure-routes';

import FastClick from 'fastclick';
FastClick.attach(document.body);

//process.env.IS_APP = true

// Configure store and routes
const browserHistory = useRouterHistory(createHistory)({
  basename: process.env.APP_DOMAIN
});

const store = configureStore({
  browserHistory,
});
const histroy = syncHistoryWithStore(browserHistory, store);
const routes = configureRoutes();


window.addEventListener('resize', () => {
  store.dispatch({
    type: RESIZE,
    payload: { width: window.innerWidth, height: window.innerHeight }
  })
})

window.addEventListener("orientationchange", () => {
  store.dispatch({
    type: ORIENTATION_CHANGE,
    payload: window.orientation
  })
});

window.addEventListener('keydown', (e) => {
  store.dispatch({
    type: KEYBOARD_DOWN,
    payload: e.keyCode
  })
})

window.addEventListener('keyup', (e) => {
  store.dispatch({
    type: KEYBOARD_UP,
    payload: e.keyCode
  })
})

//?? why no work
const mouseDebounced = _.debounce((e) => {
  console.log(e);
  store.dispatch({
    type: MOUSE_MOVE,
    payload: { x: e.pageX, y: e.pageY }
  })
}, 50)

const _shiftKeyCode = Keys.SHIFT.toString()
window.addEventListener('mousemove', (e) => {
  let _p = {
    x: e.pageX,
    xp: e.pageX / window.innerWidth,
    y: e.pageY,
    yp: e.pageY / window.innerHeight,
  }
  store.dispatch({
    type: MOUSE_MOVE,
    payload: _p
  })

  //update the selected effect
  let shiftDown = store.getState()
    .keyboard
    .get(_shiftKeyCode)
  if (shiftDown) {
    store.dispatch({
      type: EFFECTS_UPDATE_SELECTED,
      payload: _p.yp
    })
  }
})

ReactDom.render(
  <Provider store={store}>
    <Router history={histroy}>
      {routes}
    </Router>
  </Provider>, document.getElementById('app')
)
