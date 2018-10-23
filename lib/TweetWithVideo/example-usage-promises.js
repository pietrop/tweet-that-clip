/**
 * Example usage, 
 * Instantiates a TweetVideo
 * using entry point wrapped in promise 
 */


// load credentials
const dotenv = require('dotenv');
const loadEnv = dotenv.config();
// error handling credentials 
if (loadEnv.error) throw loadEnv.error;

const TweetVideo = require('./index.js');
const path = require('path');

// auth 
var OAUTH = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }

TweetVideo({
    credentials: OAUTH,
    filePath: path.join(__dirname,'../../assets/test_clipped.mp4'),
    tweetText: 'Test video upload with the @TwitterAPI and #nodejs.'
  })
  .then((res)=>{
      console.log(res);
  })
  .catch(error => console.log(error))