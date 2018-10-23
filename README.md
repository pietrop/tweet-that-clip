# `tweet-that-clip`
Tweet a video or audio clip from a video, with optional text status.

If it's an audio file it creates an animated waveform video 

If captions are provided, for either video or audio, it burns them onto the video

## Origin

Originally developed as part of [textAV 2018, for "Full Fact - tweet that clip"](https://textav.gitbook.io/textav-event-2018/unconference-projects/full-fact-tweet-that-clip) by [Pietro](https://github.com/pietrop) & [James](https://github.com/jamesdools).
 
Part of [textAV reusable components Trello board](https://trello.com/c/HBOdqlCz)

Subsequently integrated in [autoEdit.io, to enable tweeting audio or video quote](https://github.com/OpenNewsLabs/autoEdit_2/issues/74).

## Development env

 <!-- _How to run the development environment_

_Coding style convention ref optional, eg which linter to use_

_Linting, github pre-push hook - optional_ -->

 - node `v10.0.0`
 - npm `6.1.0`

## Setup
 
- Get twitter credentials
- Create a `.env` file and add that to the root of the app.

- See ["Authentication - Access Tokens"](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html) in twitter docs to get credentials. 

```
TWITTER_CONSUMER_KEY=""
TWITTER_CONSUMER_SECRET=""
TWITTER_CALLBACK=""
```

and user credentials, to post on user timelines
```
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_TOKEN_SECRET=""
```


Install [npm module `tweet-that-clip`](https://www.npmjs.com/package/tweet-that-clip)

```
npm install tweet-that-clip
```

## Usage

requrie and use in your code 

```js
const path = require('path');
const tweetThatClip = require('tweet-that-clip');
const ffmpeg = require('ffmpeg-static-electron');

const opts = {
   inputFile: path.join(__dirname,'./assets/test.mp4'),
  mediaType: 'video', // 'audio' or 'video'
  outputFile: path.join(__dirname,'/example/test-clipped.mp4'),
  inputSeconds: 10, // seconds
  durationSeconds: 20, // in seconds. Up to 2min duration 
  // Twitter text status  280 characters limit.
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/', 
  // tmp directory for creating intermediate clips when processing media
  tmpDir: path.join(__dirname,'/assets'),
  // optional path to ffmpeg. eg To burn captions, needs, optional path to ffmpeg binary - enable libas, 
  // if not provided it uses default on system if present
  // if in doubt can give the path to https://www.npmjs.com/package/ffmpeg-static-electron
  ffmpegBin: ffmpeg.path,
  // Optional caption file - if burning captions provide an srtFilePath.
  srtFilePath:  path.join(__dirname,'./assets/captions.srt')
};

tweetThatClip(opts)
  .then((res)=>{
    console.log('in example-usage for video',res.outputFile);
    // console.log(res.resTwitter);
  })
  .catch((error) => {
    console.log('Error in example-usage for video',error);
  })
```

also See [`./example-usage-video.js`](`./example-usage-video.js`) file and [`./example-usage-audio.js`](`./example-usage-audio.js`). 


### ffmpeg binary path
As seen in example below you need to provide binary for ffmpeg. eg  [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) or [`ffmpeg-static-electron`](https://www.npmjs.com/package/ffmpeg-static-electron). 

Especially when using the option to burn captions you need to provide an ffmpeg with `--enable-libass`. The two binaries linked above have been tested to work.

<!-- ### Waveform colors options

Waveform colors options, are those supported by ffmpeg, [see docs](https://ffmpeg.org/ffmpeg-utils.html#Color).

>It can be the name of a color as defined below (case insensitive match) or a [0x|#]RRGGBB[AA] sequence, possibly followed by @ and a string representing the alpha component.

> The alpha component may be a string composed by "0x" followed by an hexadecimal number or a decimal number between 0.0 and 1.0, which represents the opacity value (‘0x00’ or ‘0.0’ means completely transparent, ‘0xff’ or ‘1.0’ completely opaque). If the alpha component is not specified then ‘0xff’ is assumed.

The string ‘random’ will result in a random color.

The following names of colors are recognized:

You can see a list through 
```
ffmpeg -colors 
```

Reference list in [./ffmpeg-colors.md](./ffmpeg-colors.md). -->

### Optional credentials object
For some use cases such as electron, you might want to pass in an optional `credentials` object attribute, see example blow

```js
const opts = {
  ...
  // optional credentials 
  credentials: {
    consumerKey: "",
    consumerSecret: "",
    accessToken: "",
    accessTokenSecret: ""
  }
};
```

### Optional captions file

If you provide the path to a caption file for the selection you want to trim, it is going to be used to burn captions onto the clip.

Note timecodes and text need to be relative to the selection only, as if the sele

```js
const opts = {
  ...
 // Optional caption file - if burning captions provide an srtFilePath.
  srtFilePath:  path.join(__dirname,'./assets/captions.srt')
};
```

## System Architecture
<!-- _High level overview of "system architecture"_ -->

- At a high level it uses `fluent-ffmpeg` to trim clip and convert to [twitter video specs]( https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices) 
  - `0.5 seconds and 30 seconds (sync) / 140 seconds (async) `
  - `not exceed 15 mb (sync) / 512 mb (async)`
- For twitter video upload and status post uses [script](https://gist.github.com/jcipriano/91bff4cb4ea51c355453161b6da02986) by [@jcipriano](https://gist.github.com/jcipriano) refactored into a module.
 - It creates a tmp clipped/trimmed file and deletes it once the tweet is sent.

 In more detail, the main [`index.js`](./index.js) pulls in the modules from `lib`.


1. Trim video 
2. if audio create Waveform 
3. Burn captions - optional, if srt is provided 
4. Tweet clip  

## Build
<!-- _How to run build_ -->

No build step

## Tests
<!-- _How to carry out tests_ -->

No tests for now, just [`./example-usage-video.js`](`./example-usage-video.js`) file and [`./example-usage-audio.js`](`./example-usage-audio.js`). 
 

## Deployment
<!-- _How to deploy the code/app into test/staging/production_ -->

No deployment, as node module, but available on npm as [`tweet-that-clip`](https://www.npmjs.com/package/tweet-that-clip)


<!-- 
# TODOS

- [X] move `tweetClipHelper` to module `TweetWithVideo` to promisify module. 
- [X] index.js promisify the overall module
- [X] update PR
- [X] clean up tmp files, eg set tmp directory?


--- 
Extra

- [ ] add support for waveform colours, and mode eg line, point,p2p,cline
- [ ] add Font size as option for burn module, as well font name, and captions colours 
- [ ] ...

 -->