const ffmpeg = require('fluent-ffmpeg');
// TODO: set fluent to to use ffmpeg static

function trimVideo(inputFile, inputSeconds, durationSeconds, outputFile, callback) {
  ffmpeg(inputFile)
    .seekInput(inputSeconds)
    .setDuration(durationSeconds)
    .output(outputFile)
    .videoCodec('libx264')
    .size('1280x720')
    .aspect('16:9')
    .on('end', callback)
    .run();
}

module.exports = trimVideo;
