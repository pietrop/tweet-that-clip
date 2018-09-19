const trim = require('./trim');
const upload = require('./upload');

function tweetThatClip(opts, callback) {
  trim(opts, (err, res) => {
    if (err) return callback(err);
    console.log('Transcoding finished.');

    upload(opts.tweetText, opts.outputFile, (err, res) => {
      if (err) return callback(err);
      console.log('Transcoding finished.');

      callback(null, res);
    });
  });
};

module.exports = tweetThatClip;
