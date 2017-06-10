const xhr = require('xhr-request')
const path = require('path')
var fs = require('fs-extra')
var tmp = require('tmp');
const { ipcMain} = require('electron')
const exec = require('child_process').exec
const spawn = require('child_process').spawnSync
const Uploader = require('chewb-youtube-uploader')
const YOUTUBE_RENDER_PLAYLIST = "PLZRcgvIPIUuWGsz6oBbUnu2Mtqiq11mME"

module.exports = (tmpPath, IS_PROD) => {

  const HOST = "https://rad.wtf/redis/"

  const getVideoDuration = (videoPath) => {
    const child = spawn(`${path.join(__dirname, '../bin/ffprobe')}`, [`-print_format`, `json`, `-show_format`, `-show_streams`, `-count_frames`, `${videoPath}`])
    const stdout = child.stdout.toString('utf-8');
    return Math.round(eval(JSON.parse(stdout).streams[0].duration))
  }

  const uploadComplete = (videoId, localPath) => {
    xhr(`${HOST}sadd`, {
      method: 'POST',
      json: true,
      body: {
        key: 'deux-tube',
        value: JSON.stringify({
          id: videoId,
          duration: getVideoDuration(localPath),
        }),
      }
    })
  }

  let _uploadedYoutubeId, _totalByteSize, _uploadTimeout;
  let _currentUploadArgs;
  let _currentEvent;
  ipcMain.on('youtube-upload', (event, arg) => {

    _currentEvent = event;
    const { totalByteSize, local } = arg;
    _currentUploadArgs = Object.assign({}, arg)

    fs.appendFile(path.join(tmpPath, "log.txt"), `${_currentUploadArgs.toString()}\n`)

    _totalByteSize = totalByteSize

    let _cred = JSON.parse(fs.readFileSync(path.join(__dirname, 'ytcreds.json')))
    console.log(arg.credentials);

    Uploader.init(_cred, arg.credentials)
      .then(() => {
        let options = {
          credentials: arg.credentials,
          title: arg.title,
          privacyStatus: arg.privacy,
          description: arg.description
        }
        return Uploader.upload([arg.local],
            YOUTUBE_RENDER_PLAYLIST,
            options)
          .then(uploaded => {

            clearTimeout(_uploadTimeout)
            fs.appendFile(path.join(tmpPath, "log.txt"), "Uploaded!\n")
            fs.appendFile(path.join(tmpPath, "log.txt"), `${arg.local}\n`)
            fs.appendFile(path.join(tmpPath, "log.txt"), `${JSON.stringify(uploaded)}\n`)

            uploadComplete(uploaded, arg.local)

            event.sender.send('youtube-upload-resp', uploaded)

          })
          .finally()
      })

    Uploader.on("data", (val) => {
      if (val) {
        fs.appendFile(path.join(tmpPath, "log.txt"), `${val.toString()}\n`)
      }
    })

    Uploader.on("id", (val) => {
      if (val) {
        _uploadedYoutubeId = val;
        fs.appendFile(path.join(tmpPath, "log.txt"), `${val.toString()}\n`)
      }
    })

    let _previousVal;
    Uploader.on("progress", (val) => {
      _previousVal = val;
      fs.appendFile(path.join(tmpPath, "log.txt"), `${val.toString()}\n`)
      event.sender.send('youtube-upload-progress', val)
    })
  })

  ipcMain.on('reload', (event, arg) => {
    mainWindow.reload();
  })

  ipcMain.on('videoSaved', (event, arg) => {
    const { dir, name, base } = path.parse(arg)
    let folderToCopyTo = path.join(dir, '../', base)
    fs.copy(arg, folderToCopyTo, function(err) {
      fs.removeSync(dir)
      event.sender.send('videoSaved', folderToCopyTo)
    });
  })

  ipcMain.on('canvas-render', (event, arg) => {
    console.log(arg);
  })


  ipcMain.on('is-ready', (event, arg) => {
    const file = path.join(tmpPath, 'youtube-dl')
    const child = spawn(`ls`, [`-l`, file])
    const stdout = child.stdout.toString('utf-8');
    event.sender.send('is-ready', stdout.indexOf('rwxr-xr-x') > -1)
  })
}
