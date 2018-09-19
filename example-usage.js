const tweetThatClip = require('./index.js');

const opts = {
  inputFile: './assets/test.mp4',
  outputFile: './assets/test_clipped.mp4',
  inputSeconds: 399, // 6 min 39 sec
  durationSeconds: 15, // to 7 min so 15 sec
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/'//,
  // optional
  // ffmpegPath: "/usr/local/bin/ffmpeg",
};

tweetThatClip(opts, (err, res) => {
  console.log(err, res);
});
