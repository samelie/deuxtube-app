const { ipcRenderer } = require('electron')

const render = document.querySelector('canvas')
const ctx = render.getContext('2d')

ipcRenderer.on('canvas-render', (event, arg) => {
  console.log(arg);
  console.log(event);
  ctx.putImageData(arg, 0, 0)
})

