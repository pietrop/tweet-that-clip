/**
 * Example usage, 
 * Instantiates a TweetWithVideo
 */
// load credentials
const dotenv = require('dotenv');
const loadEnv = dotenv.config();
// error handlign credentials 
if (loadEnv.error) throw loadEnv.error;

const TweetWithVideo = require('./TweetWithVideo.js');
const path = require('path');

// auth 
var OAUTH = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }

videoTweet = new TweetWithVideo({
    OAUTH: OAUTH,
    file_path: path.join(__dirname,'../../assets/test_clipped.mp4'),
    tweet_text: 'Test video upload with the @TwitterAPI and #nodejs.'
}, (error, response)=>{
    console.log('example usage response: ',response);
});

