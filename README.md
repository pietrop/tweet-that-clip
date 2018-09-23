# `tweet-that-clip`
Tweet a video clip from a video, with optional text status.
 

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
const tweetThatClip = require('tweet-that-clip');

const opts = {
  inputFile: './assets/test.mp4',
  outputFile: './assets/test_clipped.mp4',
  inputSeconds: 300, // 
  durationSeconds: 139, // up to 140 seconds duration 
  tweetText: 'The Trussell Trust found that food bank use increased by 52% in a year in areas where Universal Credit has been rolled out. The National Audit Office observed similar findings https://fullfact.org/economy/universal-credit-driving-people-food-banks/'
};

tweetThatClip(opts, (err, res) => {
  console.log(err, res);
});
```

also See `/example-usage.js` file


### Optional ffmpeg path

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
 

## System Architecture

_High level overview of system architecture_


<!-- Twitter video upload constraints
https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices


Issue around file size
https://github.com/ttezel/twit/issues/461


Current restriction by Twit library is 15 sec 
 -->

 

## Development env

 _How to run the development environment_

_Coding style convention ref optional, eg which linter to use_

_Linting, github pre-push hook - optional_

 
 - node
 - npm 

## Build

_How to run build_

No build step

## Tests

_How to carry out tests_

No tests for now
 

## Deployment

_How to deploy the code/app into test/staging/production_

No deployment for now
