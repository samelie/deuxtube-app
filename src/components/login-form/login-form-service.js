import Q from 'bluebird';

const LOGIN_SERVICE = (() => {
  let socket

  const ERROR_TYPES = {
    INCOMPLETE:'INCOMPLETE',
    MISMATCH:'MISMATCH'
  }

  function init(s) {
    socket = s
  }

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
    return JSON.parse(localStorage.getItem(`user:${username}`)) || {}
  }

  function _setUser(username, obj) {
    localStorage.setItem(`user:${username}`, JSON.stringify(obj));
  }

  function isValid(username, password){
    let _user = _getUser(username)
    return _user.password === password
  }


  return {
    init: init,
    login: login,
    ERROR_TYPES:ERROR_TYPES
  }

})()

export default LOGIN_SERVICE
