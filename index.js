const trim = require('./lib/trim');
const upload = require('./lib/upload');

function tweetThatClip() {
  const inputFile = './assets/test.mp4';
  const outputFile = './assets/test_clipped.mp4';
  const inputSeconds = 300;
  const durationSeconds = 5;
  const tweetText = 'This is the accompanying text with the video';

  trim(inputFile, inputSeconds, durationSeconds, outputFile, (err, res) => {
    if (err) console.log(err);
    console.log('Transcoding finished.');

    upload(tweetText, outputFile, (err, res) => {
      if (err) console.log(err);
      console.log('Upload finished.');
    });
  });
};

tweetThatClip();
