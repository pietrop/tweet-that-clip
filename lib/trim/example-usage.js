const trim = require('./index.js');

trimVideo(opts, (err, res) => {
    if (err) return callback(err);
    console.log('Transcoding finished.');
})