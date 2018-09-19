const trim = require('./trim');
const upload = require('./upload');

function tweetThatClip(opts) {
  trim(opts.inputFile, opts.inputSeconds, opts.durationSeconds, opts.outputFile, (err, res) => {
    if (err) console.log(err);
    console.log('Transcoding finished.');

    upload(opts.tweetText, opts.outputFile, (err, res) => {
      if (err) console.log(err);
      console.log('Upload finished.');
    });
  });
};

module.exports = tweetThatClip;
