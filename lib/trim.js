const ffmpeg = require('fluent-ffmpeg');

function trimVideo(opts, callback) {
  if(opts.ffmpegPath !== undefined){
    ffmpeg.setFfmpegPath(opts.ffmpegPath)
  }

  ffmpeg(opts.inputFile)
    .seekInput(opts.inputSeconds)
    .setDuration(opts.durationSeconds)
    .output(opts.outputFile)
    // .audioCodec('libfaac')
    .audioCodec('copy')
    .videoCodec('libx264')
    .size('1280x720')
    .aspect('16:9')
    .format('mp4')
    .on('end', callback)
    .run();
}

module.exports = trimVideo;
