const trimVideo = require('./index.js');
const path = require('path');
//  The `time` argument may be a number (in seconds) or a timestamp string (with format `[[hh:]mm:]ss[.xxx]`).
let opts = {
    // inputFile:  '/Users/passap02/audio-to-video/assets/BodyOnTheMoor-20160610-Episode3Poison.mp3',
    inputFile: '/Users/passap02/tweet-that-clip/assets/test.mp4',
    inputSeconds: 10,
    durationSeconds: 20,
    outputFile: path.join(__dirname,'../../assets/test_clipped.mp4')
}

trimVideo(opts)
    .then((res)=>{
        console.log('in example usage')
        console.log(res);
    })
    .catch(error => console.log(error));