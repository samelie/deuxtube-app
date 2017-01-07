import {
  AUTH_INSTA,
  AUTH_YOUTUBE,
} from '../constants/action-types';

export function instaAuthed(payload = {}) {
  return {
    type: AUTH_INSTA,
    payload: payload
  };
}

export function youtubeAuth(payload = {}) {
  return {
    type: AUTH_YOUTUBE,
    payload: payload
  };
}
