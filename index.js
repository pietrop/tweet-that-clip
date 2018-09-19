const trim = require('./lib/trim');

const inputFile = './assets/test.mp4';
const outputFile = './assets/test_clipped.mp4';
const inputSeconds = 200;
const durationSeconds = 5;

trim(inputFile, inputSeconds, durationSeconds, outputFile, (err, res) => {
  if (err) console.log(err);

  console.log('Transcoding finished.');
});
