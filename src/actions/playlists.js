import {
  PLAYLIST_CREATE,
  PLAYLIST_SET,
  PLAYLIST_ITEM_MOVE,
  PLAYLIST_ITEM_DELETE,
} from '../constants/action-types';

export function createPlaylist(payload = {}) {
  return {
    type: PLAYLIST_CREATE,
    payload: payload
  };
}

export function setPlaylist(payload = {}) {
  return {
    type: PLAYLIST_SET,
    payload: payload
  };
}


export function movePlaylistItem(payload = {}) {
  return {
    type: PLAYLIST_ITEM_MOVE,
    payload: payload
  };
}

export function deletePlaylistItem(payload = {}) {
  return {
    type: PLAYLIST_ITEM_DELETE,
    payload: payload
  };
}
