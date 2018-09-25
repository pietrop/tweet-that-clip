/**
 * Trims clip, and converts to twitter video specs 
 * Tweets clip and text status
 * see specs 
 * https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
 */
const fs = require('fs');
const trimVideo = require('./lib/trim/index.js');
const TweetWithVideo = require('./lib/TweetWithVideo/index.js');

function tweetThatClip(opts, callback) {
  trimVideo(opts, (err, res) => {
    if (err) return callback(err);
    console.log('Twitter Transcoding finished.');
  
    // TODO: this could be refactored? to be a bit cleaner
    videoTweet = new TweetWithVideo({
      // if they are not set is just passed as undefined. for now keeping logic of deciding which credentials to use use within the module, while figure out cleaner solution.
      credentials: opts.credentials,
      file_path: opts.outputFile,
      tweet_text: opts.tweetText
    }, (error, response)=>{
      // Deleting the trimmed clip 
      console.log(opts.outputFile);
      fs.unlinkSync(opts.outputFile);
      console.info('Twitter upload finished.');
      if (error) {
        return callback(error,null);
      }
      else{
        return  callback(null, response);
      }
    });

  });
};

module.exports = tweetThatClip;