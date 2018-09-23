const fs = require('fs');
const Twit = require('twit');
const dotenv = require('dotenv');
const MediaUpload = require('twitter-media');

const loadEnv = dotenv.config();

function tweetVideo(opts, callback) {
// Adding support for optional keys in params, with default on env variables
// to support electron use case
let tmpConsumerKey = process.env.TWITTER_CONSUMER_KEY;
let tmpCosumerSectret =  process.env.TWITTER_CONSUMER_SECRET;
let tmpAccessToken = process.env.TWITTER_ACCESS_TOKEN;
let accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

if(opts.credentials!== undefined ){
  tmpConsumerKey = opts.credentials.consumerKey;
  tmpCosumerSectret =  opts.credentials.consumerSecret;
  tmpAccessToken = opts.credentials.accessToken;
  accessTokenSecret = opts.credentials.accessTokenSecret;
}
else{
  if (loadEnv.error) throw loadEnv.error;
}

const twitCredentials = {
  consumer_key: tmpConsumerKey,
  consumer_secret: tmpCosumerSectret,
  access_token: tmpAccessToken,
  access_token_secret: accessTokenSecret
};

// twitter-media uses slightly different naming for it's credentials object
const twitterMediaCredentials = {
  consumer_key: tmpConsumerKey,
  consumer_secret: tmpCosumerSectret,
  token: tmpAccessToken,
  token_secret: accessTokenSecret
};


  const T = new Twit(twitCredentials);
  const video = fs.readFileSync(opts.outputFile);
  const upload = new MediaUpload(twitterMediaCredentials);

  upload.uploadMedia('video', video, (err, mediaID, res) => {
    if (err) callback(err);
    console.log(mediaID);

    const tweetOpts = {
      status: opts.text,
      media_ids: mediaID
    };

    T.post('statuses/update', tweetOpts, callback);
  });
};

module.exports = tweetVideo;
