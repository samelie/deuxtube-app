import {
  QUERY_SET,
} from '../constants/action-types';


export function setQuery(payload = {}) {
  return {
    type: QUERY_SET,
    payload: payload
  };
}
