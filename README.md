# `tweet-that-clip`
Tweet a video clip from a video, with optional text status.

Originally developed as part of [textAV 2018, for "Full Fact - tweet that clip"](https://textav.gitbook.io/textav-event-2018/unconference-projects/full-fact-tweet-that-clip) by [Pietro](https://github.com/pietrop) & [James](https://github.com/jamesdools).
 
Part of [textAV reusable components Trello board](https://trello.com/c/HBOdqlCz)

## Setup

_stack - optional_

_How to build and run the code/app_

 
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

const opts = {
  // path to media file to trim and tweet
  inputFile: path.join(__dirname,'./assets/test.mp4'),
   mediaType: 'video', // 'audio' or 'video'
  // path for tmp file to trim
  outputFile: path.join(__dirname,'./assets/test_clipped.mp4'),
  inputSeconds: 300, // In seconds 
  durationSeconds: 120, // Up to 2min duration - 120 Sec.
    // Twitter text status  280 characters limit.
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/',
  // tmp directory for creating intermediate clips when processing media
  tmpDir: path.join(__dirname,'/assets')
};

tweetThatClip(opts, (err, res) => {
  console.log(err, res);
});
```

also See `/example-usage.js` file


### ffmpeg binary path

eg if used inside electron, in combination with [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) or [`ffmpeg-static-electron`](https://www.npmjs.com/package/ffmpeg-static-electron) then can pass in the path to the ffmpeg binary.

eg
```js
const ffmpeg = require('ffmpeg-static-electron');

const opts = {
...
  ffmpegPath: ffmpeg.path
};
```

If `ffmpegPath` not provided uses default one on the system, if present.

### Waveform colors options

Waveform colors options, are those supported by ffmpeg, [see docs](https://ffmpeg.org/ffmpeg-utils.html#Color).

>It can be the name of a color as defined below (case insensitive match) or a [0x|#]RRGGBB[AA] sequence, possibly followed by @ and a string representing the alpha component.

> The alpha component may be a string composed by "0x" followed by an hexadecimal number or a decimal number between 0.0 and 1.0, which represents the opacity value (‘0x00’ or ‘0.0’ means completely transparent, ‘0xff’ or ‘1.0’ completely opaque). If the alpha component is not specified then ‘0xff’ is assumed.

The string ‘random’ will result in a random color.

The following names of colors are recognized:

You can see a list through 
```
ffmpeg -colors 
```

Reference list in [./ffmpeg-colors.md](./ffmpeg-colors.md).

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

...
 

## System Architecture
_High level overview of "system architecture"_

- Uses `fluent-ffmpeg`to trim clip and convert to [twitter video specs]( https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices) 
  - `0.5 seconds and 30 seconds (sync) / 140 seconds (async) `
  - `not exceed 15 mb (sync) / 512 mb (async)`
- For twitter video upload and status post uses [script](https://gist.github.com/jcipriano/91bff4cb4ea51c355453161b6da02986) by [@jcipriano](https://gist.github.com/jcipriano) refactored into a module.
 - It creates a tmp clipped/trimmed file and deletes it once the tweet is sent.

## Development env

 _How to run the development environment_

_Coding style convention ref optional, eg which linter to use_

_Linting, github pre-push hook - optional_


 - node `v10.0.0`
 - npm `6.1.0`

## Build

_How to run build_

No build step

## Tests

_How to carry out tests_

No tests for now, just `example-usage.js` files.
 

## Deployment

_How to deploy the code/app into test/staging/production_

No deployment, as node module, but available on npm as [`tweet-that-clip`](https://www.npmjs.com/package/tweet-that-clip)



<!-- 
TODO:

- [ ] could use some kind of tmp library to decide where to store tmp trimmed clip to then delete it when done? - not sure about pros and cons

 -->