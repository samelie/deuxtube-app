import Socket from '../utils/socket';
import Q from 'bluebird';

const USER_SERVICE = (() => {
  const socket = Socket.socket

  const ERROR_TYPES = {
    INCOMPLETE:'INCOMPLETE',
    MISMATCH:'MISMATCH',
    STORE_VIDEO_FAILED:'STORE_VIDEO_FAILED',
  }

  /*
  LOGIN
  */

  function getTimeline(accessToken, userId) {
    return new Q((yes, no) => {
      let params = {
        id: userId,
        accessToken: accessToken,
      }

      let _s = `rad:instagram:timeline:resp`
      socket.on(_s, function(results) {
        socket.removeListener(_s, arguments[0].callee)
        console.log(results);
      })
      socket.emit('rad:instagram:timeline', params)
    })

  }

  return {
    getTimeline: getTimeline,
    ERROR_TYPES:ERROR_TYPES
  }

})()

export default USER_SERVICE
