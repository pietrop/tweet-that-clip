/**
 * convert to twitter video Specs, same as trim module, but without the trimming.
 * See Twitter Docs for for more info
* https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices.html
 */
const ffmpeg = require('fluent-ffmpeg');

function convertToTwitterVideoSpecs(opts, callback) {
  if(opts.ffmpegPath !== undefined){
    ffmpeg.setFfmpegPath(opts.ffmpegPath)
  }
  // convert to twitter specs 
  ffmpeg(opts.inputFile)
    // .seekInput(opts.inputSeconds)
    // .setDuration(opts.durationSeconds)
    .output(opts.outputFile)
    // .audioCodec('libfaac')
    .audioCodec('aac')
    .videoCodec('libx264')
    .size('1280x720')
    .aspect('16:9')
    .format('mp4')
    .on('end', ()=>{
        if(callback){callback(null, opts.outputFile)}
      }
    )
    .on('error',(error)=>{
      if(callback){callback(error, null)}
    })
    .run();
    // if audio make wave form - eg options.fileType === 'audio' // default video 

    // if srt file provided, add caption - option.srtFile

}

module.exports = convertToTwitterVideoSpecs;
