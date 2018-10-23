/**
 * convert to twitter video Specs, same as trim module, but without the trimming.
 * See Twitter Docs for for more info
* https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices.html
 */
const ffmpeg = require('fluent-ffmpeg');

function convertToTwitterVideoSpecs(opts, callback) {
  if(opts.ffmpegBin !== undefined){
    ffmpeg.setFfmpegPath(opts.ffmpegBin)
  }

  return new Promise((resolve, reject)=>{
    ffmpeg(opts.inputFile)
      .output(opts.outputFile)
      .audioCodec('aac')
      .videoCodec('libx264')
      .size('1280x720')
      .aspect('16:9')
      .format('mp4')
      .on('end', ()=>{
          resolve(opts.outputFile);
      })
      .on('error',(error)=>{
        reject(error);
      })
      .run();
  })
}

module.exports = convertToTwitterVideoSpecs;
