const fs = require('fs');
const Twit = require('twit');
const dotenv = require('dotenv');
const MediaUpload = require('twitter-media');

const loadEnv = dotenv.config();
if (loadEnv.error) throw loadEnv.error;

const twitCredentials = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

//twitter-media uses slightly different naming for it's credentials object
const twitterMediaCredentials = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

function tweetVideo(text, uploadFile, callback) {
  const T = new Twit(twitCredentials);
  const video = fs.readFileSync(uploadFile);
  const upload = new MediaUpload(twitterMediaCredentials);

  upload.uploadMedia('video', video, (err, mediaID, res) => {
    if (err) callback(err);
    console.log(mediaID);

    const tweetOpts = {
      status: text,
      media_ids: mediaID
    };

    T.post('statuses/update', tweetOpts, callback);
  });
};

module.exports = tweetVideo;
