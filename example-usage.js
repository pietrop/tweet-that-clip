const tweetThatClip = require('./index.js');

const opts = {
  inputFile: './assets/test.mp4',
  outputFile: './assets/test_clipped.mp4',
  inputSeconds: 300, // 
  durationSeconds: 139, // up to 140 seconds duration 
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/'//,
  // optional
  // ffmpegPath: "/usr/local/bin/ffmpeg",
};

tweetThatClip(opts, (err, res) => {
  console.log(err, res);
});
