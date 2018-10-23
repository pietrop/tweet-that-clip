/**
 * Example video usage, with with captions
 */
const tweetThatClip = require('./index.js');
const path = require('path');

const opts = {
  inputFile: path.join(__dirname,'./assets/test.mp4'),
  mediaType: 'video', // 'audio' or 'video'
  outputFile: path.join(__dirname,'/example/test-clipped.mp4'),
  inputSeconds: 10, // seconds
  durationSeconds: 20, // in seconds. Up to 2min duration 
  // Twitter text status  280 characters limit.
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/', 
  // tmp directory for creating intermediate clips when processing media
  tmpDir: path.join(__dirname,'/assets'),
  // optional path to ffmpeg. eg To burn captions, needs, optional path to ffmpeg binary - enable libas, 
  // if not provided it uses default on system if present
  // if in doubt can give the path to https://www.npmjs.com/package/ffmpeg-static-electron
  ffmpegBin: "/usr/local/bin/ffmpeg",
  // Optional caption file - if burning captions provide an srtFilePath.
  srtFilePath:  path.join(__dirname,'./assets/captions.srt')
  // credentials: {
  //   consumerKey: "",
  //   consumerSecret: "",
  //   accessToken: "",
  //   accessTokenSecret: ""
  // }
};

tweetThatClip(opts)
  .then((res)=>{
    console.log('in example-usage for video',res.outputFile);
    // console.log(res.resTwitter);
  })
  .catch((error) => {
    console.log('Error in example-usage for video',error);
  })
