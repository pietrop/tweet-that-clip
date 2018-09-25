const tweetThatClip = require('./index.js');
const path = require('path');

const opts = {
  inputFile: path.join(__dirname,'./assets/test.mp4'),
  outputFile: path.join(__dirname,'./assets/test_clipped.mp4'),
  inputSeconds: 10, // seconds
  durationSeconds: 10, // in seconds. Up to 2min duration 
  // Twitter text status  280 characters limit.
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/'//, 
  // optional ffmpeg path
  // ffmpegPath: "/usr/local/bin/ffmpeg" // optional
  // credentials: {
  //   consumerKey: "",
  //   consumerSecret: "",
  //   accessToken: "",
  //   accessTokenSecret: ""
  // }
};

tweetThatClip(opts, (err, res) => {
  console.log('in example-usage');
  console.log(err, res);
});
