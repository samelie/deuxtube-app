'use strict';

const YOUTUBE_RENDER_PLAYLIST = "PLZRcgvIPIUuWGsz6oBbUnu2Mtqiq11mME"
const electron = require('electron')
const xhr = require('xhr-request')
const { ipcMain } = require('electron')
const path = require('path')
var fs = require('fs-extra')
var tmp = require('tmp');
const exec = require('child_process').exec
const spawn = require('child_process').spawnSync
const Recorder = require('./app_js/recorder')
const Uploader = require('chewb-youtube-uploader')

const IS_PROD = true
const HOST = "https://rad.wtf/redis/"

// Module to control application life.
const app = electron.app
  //const recorder = Recorder()
  // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const getVideoDuration = (videoPath) => {
  const child = spawn(`ffprobe`, [`-print_format`, `json`, `-show_format`, `-show_streams`, `-count_frames`, `${videoPath}`])
  const stdout = child.stdout.toString('utf-8');
  return Math.round(eval(JSON.parse(stdout).streams[0].duration))
}

ipcMain.on('youtube-upload', (event, arg) => {
  let _cred = JSON.parse(fs.readFileSync(path.join(__dirname, 'chewb/ytcreds.json')))
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

          xhr(`${HOST}sadd`, {
            method: 'POST',
            json: true,
            body: {
              key: 'deux-tube',
              value: JSON.stringify({
                id: uploaded,
                duration: getVideoDuration(arg.local),
              }),
            }
          })

          event.sender.send('youtube-upload-resp', uploaded)
        })
        .finally()
    })
  Uploader.on("progress", (val) => {
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

const tmpDir = path.join(path.parse(tmp.fileSync().name).dir, 'deux-tube')
ipcMain.on('is-ready', (event, arg) => {
  const file = path.join(tmpDir, 'youtube-dl')
  const child = spawn(`ls`, [`-l`, file])
  const stdout = child.stdout.toString('utf-8');
  event.sender.send('is-ready', stdout.indexOf('rwxr-xr-x') > -1)
})

let mainWindow, commonWindow

const chewbPath = IS_PROD ? 'chewb/index.js' : 'chewb/index.js'

/*require('dotenv')
  .config({
    path: path.join(process.cwd(), 'chewb/envvars')
  })*/
//server
//let server = new Chewb(path.join(__dirname, 'chewb/envvars'))

let server = exec(`node ${chewbPath}`, { maxBuffer: NaN },
  (e, stdout, stderr) => {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
  });
server.stdout.on('data', function(chunk) {
  console.log(chunk);
});

/*
server.stdout.on('data', (data) => {
  console.log(data);
});

server.stderr.on('data', (data) => {
  console.log("Error!");
  console.log(data);
});*/











let python;
if (IS_PROD) {
  //const child = spawn(`python`, ['-m', 'SimpleHTTPServer', '1608'])
  process.chdir('dist')
  python = exec(`python -m SimpleHTTPServer 1608`)
  process.chdir('../')
}




function createWindow() {
  //commonWindow = new BrowserWindow({ width: 640, height: 360 })
  //commonWindow.loadURL(`file://${__dirname}/dist/output-window.html`);


  mainWindow = new BrowserWindow({ width: IS_PROD ? 960 : 1200, height: 600 })

  if (IS_PROD) {
    mainWindow.loadURL('http://localhost:1608')
  } else {
    mainWindow.loadURL(`http://localhost:8081`)
  }

  if (!IS_PROD) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function() {
    if (IS_PROD) {
      python.kill()
    }
    server.kill()
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
