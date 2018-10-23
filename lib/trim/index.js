/**
 * Trims video and match to the specs from the Twitter video documentation.
 * See Twitter Docs for for more info
 * https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
 */
const ffmpeg = require('fluent-ffmpeg');

function trimVideo(opts, callback) {
  if(opts.ffmpegBin !== undefined){
    ffmpeg.setFfmpegPath(opts.ffmpegBin)
  }
  return new Promise((resolve, reject)=>{
  ffmpeg(opts.inputFile)
    .seekInput(opts.inputSeconds)
    .setDuration(opts.durationSeconds)
    .output(opts.outputFile)
    .audioCodec('aac')
    .videoCodec('libx264')
    .size('1280x720')
    .aspect('16:9')
    .format('mp4')
    .on('end', ()=>{
        resolve(opts.outputFile);
      }
    )
    .on('error',(error)=>{
      reject(error);
    })
    .run();
  })
}

module.exports = trimVideo;
