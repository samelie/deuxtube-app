'use strict';

const IS_PROD = true

const { app, ipcMain, Menu, BrowserWindow } = require('electron')
const path = require('path')
var fs = require('fs')
var tmp = require('tmp');
const exec = require('child_process').exec
const spawn = require('child_process').spawnSync

let tmpPath = tmp.dirSync();
const { dir } = path.parse(tmpPath.name)
tmpPath = path.join(dir, "deux-tube")
spawn('rm',['-rf', tmpPath])
fs.mkdirSync(tmpPath)

const AppJs = require('./electron-js/main.app')(tmpPath, IS_PROD)


let mainWindow, commonWindow

const chewbPath = IS_PROD ? 'chewb/index.js' : 'chewb/index.js'


let server = exec(`${path.join(__dirname, 'bin/node')} ${path.join(__dirname, chewbPath)}`, { maxBuffer: NaN },
  (e, stdout, stderr) => {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
  });

server.stdout.on('data', function(chunk) {
  fs.appendFile(path.join(tmpPath, "log.txt"), chunk)
  console.log(chunk);
});


function createWindow() {
  //commonWindow = new BrowserWindow({ width: 640, height: 360 })
  //commonWindow.loadURL(`file://${__dirname}/dist/output-window.html`);

  mainWindow = new BrowserWindow({ width: IS_PROD ? 960 : 1200, height: 600 })

  if (IS_PROD) {
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
    //mainWindow.loadURL('http://localhost:1608')
  } else {
    mainWindow.loadURL(`http://localhost:8081`)
  }

  if (!IS_PROD) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function() {
    server.kill()
    mainWindow = null
  })

  var template = [{
    label: "Application",
    submenu: [
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); } }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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
