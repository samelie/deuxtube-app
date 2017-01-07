'use strict';

const YOUTUBE_RENDER_PLAYLIST = "PLZRcgvIPIUuWGsz6oBbUnu2Mtqiq11mME"
const electron = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
var fs = require('fs-extra')
const exec = require('child_process').exec
const Recorder = require('./app_js/recorder')
const Chewb = require('@samelie/chewb')
const Uploader = require('@samelie/youtube-uploader')
  // Module to control application life.
const app = electron.app
  //const recorder = Recorder()
  // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

ipcMain.on('youtube-upload', (event, arg) => {
  console.log(arg) // prints "ping"
  let _cred = JSON.parse(fs.readFileSync(path.join(__dirname, 'chewb/ytcreds.json')))
  Uploader.init(_cred)
    .then(() => {
      let options = {
        title: arg.title,
        description: arg.description
      }
      Uploader.upload([arg.local], YOUTUBE_RENDER_PLAYLIST, options)
        .then(uploaded => {
          event.sender.send('youtube-upload-resp', uploaded)
        })
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


let mainWindow

//server
//let server = new Chewb(path.join(__dirname, 'chewb/envvars'))
let server = exec('node chewb/chewb.js', { maxBuffer: NaN },
  (e, stdout, stderr) => {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
  });

/*
server.stdout.on('data', (data) => {
  console.log(data);
});

server.stderr.on('data', (data) => {
  console.log("Error!");
  console.log(data);
});*/

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 600 })

  //dev
  mainWindow.loadURL(`http://localhost:8081`)

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
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
