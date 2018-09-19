const tweetThatClip = require('./index.js');

const opts = {
  inputFile: './assets/test.mp4',
  outputFile: './assets/test_clipped.mp4',
  inputSeconds: 300,
  durationSeconds: 5,
  tweetText: 'This is the accompanying text with the video'
};

tweetThatClip(opts);
