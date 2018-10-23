const burnCaptions  = require('./index.js');

// let videoSrcExample = '/Users/passap02/audio-to-video/assets/newsnight-moor-mystery-portrait.mp4';
// let videoSrcExample = '/Users/passap02/tweet-that-clip/assets/test_clipped.mp4.burnt.mp4';
let videoSrcExample = '/Users/passap02/tweet-that-clip/assets/test_clipped.mp4';
let srtFilePathExample = '/Users/passap02/audio-to-video/assets/captions.srt';
let outputFileExample ='/Users/passap02/tweet-that-clip/assets/test_clipped-burnt-2.mp4';

burnCaptions({
    inputFile: videoSrcExample,
    srtFilePath: srtFilePathExample,
    outputFile: outputFileExample,
    // path to ffmpeg binary - enable libas, if not provided it uses default on system if present
    ffmpegBin: '/Users/passap02/autoEdit_2/node_modules/ffmpeg-static-electron/bin/mac/x64/ffmpeg'
    })
    .then((res)=>{
        console.log('in example usage')
        console.log(res);
    })
    .catch(error => console.log(error));