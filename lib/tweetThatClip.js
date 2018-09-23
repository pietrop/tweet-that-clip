const trim = require('./trim');
const upload = require('./upload');

function tweetThatClip(opts, callback) {
  trim(opts, (err, res) => {
    if (err) return callback(err);
    console.log('Twitter Transcoding finished.');

    upload(opts, (err, res) => {
      if (err) return callback(err,null);
      
      console.info('Twitter upload finished.');
      callback(null, res);
    });
  });
};

module.exports = tweetThatClip;
