const tweetThatClip = require('./index.js');

const opts = {
  inputFile: './assets/test.mp4',
  outputFile: './assets/test_clipped.mp4',
  inputSeconds: 405,
  durationSeconds: 15,
  tweetText: 'This is the accompanying text with the video'
};

tweetThatClip(opts, (err, res) => {
  console.log(err, res);
});
