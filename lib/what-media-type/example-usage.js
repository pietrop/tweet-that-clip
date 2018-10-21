const whatMediaType = require('./index.js');
let audioSrcExample = '/Users/passap02/audio-to-video/assets/test-audio.m4a';
let srtFilePathExample = '/Users/passap02/audio-to-video/assets/captions.srt';
let videoSrcExample = '/Users/passap02/audio-to-video/assets/newsnight-moor-mystery-portrait.mp4';

whatMediaType({
    mediaSrc: audioSrcExample
    // ffprobeBin: ,//optional
}, (mediaTypeResponse)=>{
    console.log(mediaTypeResponse)
})
