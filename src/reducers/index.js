import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

import resize from './resize';
import app from './app';
import videoTracks from './video_tracks';
import playlists from './playlists';
import keyboard from './keyboard';
import effects from './effects';
import query from './query';
import playbar from './playbar';
import videoState from './video_state';
import audio from './audio';
import mouse from './mouse';
import videoRecord from './video_record';
/*import terms from './terms';
import ui from './ui';
import projects from './projects';
import platform from './platform';*/

// Combine all reducers with routeReducer named `routing` into a single rootReducer
// See _media-queries.scss for media query sizes
export default combineReducers({
  routing,
  resize,
  audio,
  app,
  videoTracks,
  playbar,
  playlists,
  effects,
  videoState,
  videoRecord,
  query,
  keyboard,
  mouse,
  browser: createResponsiveStateReducer({
    mobile: 360,
    phablet: 540,
    tablet: 768,
    tabletH: 1024,
    desktop: 1280,
    desktopM: 1440,
    desktopL: 1680,
    desktopXL: 1920,
  }),
});

