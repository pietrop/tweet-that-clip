/**
 * Tweets text with video.
 * Uploads a video file, in a chunked async request, 
 * and when done tweets using that media with text status
 * 
 * Video file needs to meet twitter media specs for async, for duration and size.
 * 
 * refactor from originally script by [@jcipriano](https://gist.github.com/jcipriano) 
 * https://gist.github.com/jcipriano/91bff4cb4ea51c355453161b6da02986
 */

const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv');
const loadEnv = dotenv.config();

const MEDIA_ENDPOINT_URL = 'https://upload.twitter.com/1.1/media/upload.json'
const POST_TWEET_URL = 'https://api.twitter.com/1.1/statuses/update.json'

let form_data = {};

/**
 * Video Tweet constructor
 **/
const TweetWithVideo = function (data) {

  // set credentials - credentials attribute or ENV vat
  let tmpConsumerKey; 
  let tmpCosumerSectret; 
  let tmpAccessToken; 
  let accessTokenSecret; 

  if(data.credentials!== undefined ){
    tmpConsumerKey = data.credentials.consumerKey;
    tmpCosumerSectret =  data.credentials.consumerSecret;
    tmpAccessToken = data.credentials.accessToken;
    accessTokenSecret = data.credentials.accessTokenSecret;
  }
  else{
    // error handling if ENV not set. OR using some other ENV var setup
    if (loadEnv.error || (process.env.TWITTER_CONSUMER_KEY === undefined)){
      throw loadEnv.error
    }
    // otherwise set using env variables
    else{
      tmpConsumerKey = process.env.TWITTER_CONSUMER_KEY;
      tmpCosumerSectret =  process.env.TWITTER_CONSUMER_SECRET;
      tmpAccessToken = process.env.TWITTER_ACCESS_TOKEN;
      accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    };
    
  }

  const OAUTH = {
    consumer_key: tmpConsumerKey,
    consumer_secret: tmpCosumerSectret,
    token: tmpAccessToken,
    token_secret: accessTokenSecret
  };
  // end of setting credentials

  var self = this;
  self.OAUTH = OAUTH;
  self.file_path = data.file_path;
  self.tweet_text = data.tweet_text;
  self.total_bytes = undefined;
  self.media_id = undefined;
  self.processing_info = undefined;

  // retreives file info and inits upload on complete
  fs.stat(self.file_path, function (error, stats) {
    self.total_bytes = stats.size
    self.upload_init();
  });
};

/**
 * Inits media upload
 */
TweetWithVideo.prototype.upload_init = function () {

  console.info('INIT');

  var self = this;

  form_data = {
    'command': 'INIT',
    'media_type': 'video/mp4',
    'total_bytes': self.total_bytes,
    'media_category': 'tweetvideo'
  }

  // inits media upload
  request.post({url: MEDIA_ENDPOINT_URL, oauth: self.OAUTH, formData: form_data}, function (error, response, body) {
    // TODO: error handling, eg file too long
    data = JSON.parse(body)

    // store media ID for later reference
    self.media_id = data.media_id_string;
    console.log(data);
    // start appending media segments
    self.upload_append();
  });
}

/**
 * Uploads/appends video file segments
 */
TweetWithVideo.prototype.upload_append = function () {

  var buffer_length = 5000000;
  var buffer = Buffer.alloc(buffer_length);
  var bytes_sent = 0;

  var self = this;

  // open and read video file
  fs.open(self.file_path, 'r', function(error, file_data) {

    var bytes_read, data,
    segment_index = 0,
    segments_completed = 0;

    // upload video file in chunks
    while (bytes_sent < self.total_bytes) {
      console.info('APPEND');

      bytes_read = fs.readSync(file_data, buffer, 0, buffer_length, null);
      data = bytes_read < buffer_length ? buffer.slice(0, bytes_read) : buffer;
      
      form_data = {
          command: 'APPEND',
          media_id: self.media_id,
          segment_index: segment_index,
          media_data: data.toString('base64')
      };

      console.log(self.media_id);

      request.post({url: MEDIA_ENDPOINT_URL, oauth: self.OAUTH, formData: form_data}, function () {
        segments_completed = segments_completed + 1;

        console.log('segment_completed');
        if (segments_completed == segment_index) {
          console.log('Upload chunks complete');
          self.upload_finalize();
        }
      });
      
      bytes_sent = bytes_sent + buffer_length;
      segment_index = segment_index + 1;
    }
  });
}

/**
 * Finalizes media segments uploaded 
 */
TweetWithVideo.prototype.upload_finalize = function () {
  console.info('FINALIZE');
  var self = this;

  form_data = {
    'command': 'FINALIZE',
    'media_id': self.media_id
  }
  
  // finalize uploaded chunck and check processing status on compelete
  request.post({url: MEDIA_ENDPOINT_URL, oauth: self.OAUTH, formData: form_data}, function(error, response, body) {

    data = JSON.parse(body)
    self.check_status(data.processing_info);
  });
}


/**
 * Checks status of uploaded media
 */
TweetWithVideo.prototype.check_status = function (processing_info) {
  var self = this;

  // if response does not contain any processing_info, then video is ready
  if (!processing_info) {
    self.tweet();
    return;
  }

  console.info('STATUS');

  request_params = {
    'command': 'STATUS',
    'media_id': self.media_id
  }

//   check processing status 
  request.get({url: MEDIA_ENDPOINT_URL, oauth: self.OAUTH, qs: request_params}, function(error, response, body) {

    data = JSON.parse(body)

    console.log('Media processing status is ' + processing_info.state);

    if (processing_info.state == 'succeeded') {
      self.tweet();
      return
    }
  
    else if (processing_info.state == 'failed') {
      return;
    }

    // check status again after specified duration
    var timeout_length = data.processing_info.check_after_secs ? data.processing_info.check_after_secs * 1000 : 0;

    console.log('Checking after ' + timeout_length + ' milliseconds');

    setTimeout(function () {
      self.check_status(data.processing_info)
    }, timeout_length);
  });
}

/**
 * Tweets text with attached media
 */
TweetWithVideo.prototype.tweet = function (cb) {

  var self = this;

  request_data = {
    'status': self.tweet_text,
    'media_ids': self.media_id
  }

  // publish Tweet
  request.post({url: POST_TWEET_URL, oauth: self.OAUTH, form: request_data}, function(error, response, body) {
    if(error){
      if(cb){cb(error, null)};
    }
    else{
      let data = JSON.parse(body);
      if(cb){cb(null, data)};
    }    
  });
}

module.exports = TweetWithVideo;
