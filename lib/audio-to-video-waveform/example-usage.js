const audioToVideoWaveForm = require('./index.js');

// let audioSrcExample = '/Users/passap02/audio-to-video/assets/test-audio.m4a';
let audioSrcExample = '/Users/passap02/tweet-that-clip/assets/test.mp3';
let outputFileExample= '/Users/passap02/tweet-that-clip/example/wave-form-test-clipped.mp4';

// audioToVideoWaveForm({
//     audioSrc: audioSrcExample,
//     outputFile: outputFileExample
//     // TODO: shoudl refactor this to return a promise?
//  }, (res)=>{
//      console.log('done processing');
//      // do something with output file
//      console.log(res)
//  });

audioToVideoWaveForm({
        audioSrc: audioSrcExample,
        outputFile: outputFileExample
    })
    .then((res)=>{
        console.log(res);
    })
    .catch(error => console.log(error));