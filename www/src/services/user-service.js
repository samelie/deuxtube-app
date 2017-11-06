import Socket from '../utils/socket';
import Q from 'bluebird';

const USER_SERVICE = (() => {
  const socket = Socket.remoteSocket

  const ERROR_TYPES = {
    INCOMPLETE:'INCOMPLETE',
    MISMATCH:'MISMATCH',
    STORE_VIDEO_FAILED:'STORE_VIDEO_FAILED',
  }

  /*
  LOGIN
  */

  function login(username, password) {
    return new Q((yes, no) => {

      if(!password|| !username){
          no(new Error(ERROR_TYPES.INCOMPLETE))
      }
      let params = {
        username: username
      }

      let _s = `rad:user:login:resp`
      socket.on(_s, function(results) {
        socket.removeListener(_s, arguments[0].callee)
        let _user = _getUser(username)
        //new
        if(results === 1){
          savePasswordInLocalStorage(username, password)
          yes(_getUser(username))
        //eists
        }else if(results === 0){
          if(!isValid(username, password)){
            no(new Error(ERROR_TYPES.MISMATCH))
          }else{
            yes(_getUser(username))
          }
        }
      })
      console.log(params);
      socket.emit('rad:user:login', params)
    })
  }

  function savePasswordInLocalStorage(username, pass) {
    let _user = _getUser(username)
    _user.username = username
    _user.password = pass
    _setUser(username, _user)
  }

  function _getUser(username) {
    const u = JSON.parse(localStorage.getItem(`user:${username}`)) || {}
    console.log(u);
    return u
  }

  function _setUser(username, obj) {
    localStorage.setItem(`user:${username}`, JSON.stringify(obj));
  }

  function isValid(username, password){
    let _user = _getUser(username)
    return _user.password === password
  }


  /*
  SAVE
  */

  function storeVideo(username, field, value) {
     return new Q((yes, no) => {

      let params = {
        key: username,
        field: field,
        value:value
      }

      let _s = `rad:user:videos:resp`
      socket.on(_s, function(results) {
        socket.removeListener(_s, arguments[0].callee)
        if(results === 1){
          yes(true)
        }else{
          no(new Error(ERROR_TYPES.STORE_VIDEO_FAILED))
        }
      })
      console.log(params);
      socket.emit('rad:user:videos', params)
    })
  }


  return {
    login: login,
    getUser: _getUser,
    storeVideo: storeVideo,
    ERROR_TYPES:ERROR_TYPES
  }

})()

export default USER_SERVICE
