var tmp = require('tmp');
var path = require('path');
const fs = require('fs')
const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise(function(resolve, reject) {
    var tmpobj = tmp.dirSync();
    const { dir } = path.parse(tmpobj.name)
    tmpobj = path.join(dir, "deux-tube")
    console.log("-- tmp --");
    console.log(tmpobj);
    const output = path.join(tmpobj, 'youtube-dl')
    try {
      fs.mkdirSync(tmpobj)
    } catch (e) {}
    try {
      fs.unlinkSync(output)
    } catch (e) {}
    var args = [
      '-L',
      'https://yt-dl.org/downloads/latest/youtube-dl',
      '-o',
      output
    ]
    spawn('curl', args)
    let pSize = 0
    let i = setInterval(() => {
      try {
        const { size } = fs.statSync(output)
        if (pSize === size) {
          spawn('chmod', ['a+rx', output])
          clearInterval(i)
          resolve(output)
        }
        pSize = size
      } catch (e) {

      }
    }, 1000)
  })
}
