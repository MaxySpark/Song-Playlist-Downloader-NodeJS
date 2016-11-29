var colors = require('colors');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
fs.readdir('./downloads/',function(err, files){
   if (err) {
      return console.error(err);
   }
   if (!fs.existsSync('convertedfiles')){
            fs.mkdirSync('convertedfiles');
        }
   files.forEach(function(mfile){
        ffmpeg(__dirname+'/downloads/'+mfile)
        .save(__dirname+'/convertedfiles/'+mfile.replace(/\.m4a/g,'')+'.mp3')
        .on('end', function() {
        console.log('Finished Converting '+ mfile.yellow.bold);
        fs.unlink(__dirname+'/downloads/'+mfile, (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + mfile.red.bold);
        }); 
    });
   });
});
