import {
  PLAYLIST_NEXT,
  PLAYLIST_PREVIOUS,
} from '../constants/action-types';

export function playlistNextVideo(payload = {}) {
  return {
    type: PLAYLIST_NEXT,
    payload: payload
  };
}

export function playlistPreviousVideo(payload = {}) {
  return {
    type: PLAYLIST_PREVIOUS,
    payload: payload
  };
}
