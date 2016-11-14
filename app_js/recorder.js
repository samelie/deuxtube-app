const DASHSAVE = require('@samelie/mp4-dash-record');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
//const rimraf = require('rimraf');
//const REDIS = require('./redis');


module.exports = function UserRecord() {

  const _recorder = new DASHSAVE()
  const _saveHash = uuid.v4()
  let saveDirectory
  tmp.dir((err, dir, cleanupCallback) => {
    if (err) throw err;
    saveDirectory = path.join(dir, _saveHash)
    fs.mkdirSync(saveDirectory)
    _recorder.saveDirectory = saveDirectory
  })

  function addAudio(buffer) {
    console.log('audio', buffer.length);
    _recorder.addAudio(buffer)
  }

  function addFrame(base64Str) {
    console.log('video', base64Str.length);
    return _recorder.saveImage(base64Str).finally()
  }

  function onAddBuffer(buffer) {
    console.log('video', buffer.length);
    _recorder.addFrame(buffer)
    socket.emit('rad:recorder:frame:success')
  }

  function save(options) {
    if (!options) {
      console.log("No save options socket record onSave()");
      return
    }
    return _recorder.save(options)
      .then(final => {

        console.log(final);
        /*return GOOGLE.store(final)
          .then(uploadedPath => {

            REDIS.hset(`${process.env.REDIS_PROJECT}:saves:google`, _saveHash, uploadedPath)

            socket.emit('rad:recorder:save:success', {
              url: uploadedPath,
              local: final
            })
          })*/
      }).finally()
  }

  function destroy() {
    _recorder.destroy()
  }

  return {
    addFrame,
    addAudio,
    save
  }

}
