
var GOOGLE = require('google-cloudstorage-commands');
var fs = require('fs');
var path = require('path');

var BUCKET_NAME = 'samrad-deuxtube/'
var BUCKET = `gs://${BUCKET_NAME}`
console.log(`${BUCKET}www-assets/assets/`);

GOOGLE.upload(path.join(process.cwd(),"www-assets/"), `${BUCKET}www-assets/assets/`, true)
  .then(() => {
    console.log("Success");
  })
  .catch(err => {
    console.log(err);
  })

GOOGLE.upload(path.join(process.cwd(),"www/dist/assets"), `${BUCKET}www-assets/assets/www-assets/`, true)
  .then(() => {
    console.log("Success");
  })
  .catch(err => {
    console.log(err);
  })
