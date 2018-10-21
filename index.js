/**
 * Trims clip, and converts to twitter video specs 
 * Tweets clip and text status
 * see specs 
 * https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
 */
const path = require('path');
const fs = require('fs');
const trimVideo = require('./lib/trim/index.js');
const convertToTwitterVideoSpecs = require('./lib/convert-to-twitter-video-specs/index.js')
const audioToVideoWaveForm = require('./lib/audio-to-video-waveform/index.js');
const burnCaptions  = require('./lib/burn-captions/index.js');
const TweetWithVideo = require('./lib/TweetWithVideo/index.js');

// TODO: needs refactoring and simplifying 
function tweetThatClip(opts, callback) {
  let fileExtension = path.extname(opts.outputFile);
  let tmpOutputForTrim = `${opts.inputFile}.trimmed${fileExtension}`;
  let tmpOutputForWave = `${opts.outputFile}.wave${fileExtension}`;
  let tmpOutputForBunt = `${opts.outputFile}.burnt${fileExtension}`;
  // if there is no SRT file, then skip burning captions for audio
  if(opts.srtFilePath === undefined && opts.mediaType ==='audio'){
    tmpOutputForBunt = opts.outputFile;
  }
  // if there is no SRT file, then skip burning captions for video
  if(opts.srtFilePath === undefined && opts.mediaType ==='video'){
    tmpOutputForTrim = opts.outputFile;
  }

  trimVideo({
    inputFile: opts.inputFile,
    outputFile: tmpOutputForTrim,
    inputSeconds: opts.inputSeconds,
    durationSeconds: opts.durationSeconds
  }, (err, res) => {
    // if (err) return callback(err);
    console.log('Twitter Trimming finished.');
        // if it's audio convert to video by adding wave form 
        if(opts.mediaType === 'audio'){
          console.log('is audio')
          audioToVideoWaveForm({
            audioSrc: tmpOutputForTrim,
            outpuFileName: tmpOutputForWave
            // TODO: should refactor this to return a promise?
          }, (res)=>{
              console.log('Done creating audio to video waveform');
              convertToTwitterVideoSpecs({
                inputFile: tmpOutputForWave,
                outputFile: tmpOutputForBunt
                // outputFile: '/Users/passap02/tweet-that-clip/assets/test_burnt.mp4'
              },(error, res)=>{
                console.log('Done converting to twitter video specs ', tmpOutputForBunt);
                // do something with output file
                console.log(res)
                if(opts.srtFilePath!== undefined){
                  burnCaptions({
                  // videoSrc: opts.outputFile+'.twitterspec'+fileExtension,
                  videoSrc: tmpOutputForBunt,
                  srtFilePath: opts.srtFilePath,
                  outputFile:  opts.outputFile,
                  ffmpegPath: opts.ffmpegPath
                  }, (res)=>{
                      console.log('Done burning captions', opts.outputFile);
                      // do something with result
                      console.log(res);
                      tweetClipHelper(opts, (error, res)=>{
                        console.log(error, res)
                          if(callback){callback(null,res)};
                      })
                  })
                }else{
                  tweetClipHelper(opts, (error, res)=>{
                    console.log(error, res)
                    if(callback){callback(null,res)};
                  })
                }
              })
              
          });
        } 
        // otherwise if video continue and add captions - ? optional for now
        else if(opts.mediaType ==='video'){
          console.log('is video')
          if(opts.srtFilePath!== undefined){
            burnCaptions({
            // videoSrc: opts.outputFile+'.twitterspec'+fileExtension,
              videoSrc: tmpOutputForTrim,
              srtFilePath: opts.srtFilePath,
              outputFile:  opts.outputFile,//  __dirname+'/test-burnt.mp4'
              ffmpegPath: opts.ffmpegPath
            }, (res)=>{
              console.log('Done burning captions', opts.outputFile);
                // do something with result
                console.log(res);
                tweetClipHelper(opts, (error, res)=>{
                  console.log(error, res)
                  if(callback){callback(null,res)};
                })
            })
          } else{
            tweetClipHelper(opts, (error, res)=>{
              console.log(error, res);
              if(callback){callback(null,res)};
            })
          }
        }
  });

  /**
   * Helper function to remove tmp files used to create segment
   * to upload to twitter
   * @param {string} final  - expects path to final clip sent to twitter
   */
  function cleanUpTmpFiles(final){
    ifPresentDeleteFile(tmpOutputForTrim);
    ifPresentDeleteFile(tmpOutputForWave);
    ifPresentDeleteFile(tmpOutputForBunt);
    ifPresentDeleteFile(final);
  }

  function tweetClipHelper(opts, callback){
    // TODO: this could be refactored? to be a bit cleaner
    let videoTweet = new TweetWithVideo({
      // if they are not set is just passed as undefined. for now keeping logic of deciding which credentials to use use within the module, while figure out cleaner solution.
      credentials: opts.credentials,
      file_path: opts.outputFile,
      tweet_text: opts.tweetText
    }, (error, response)=>{
      // Deleting the trimmed clip 
      console.log(opts.outputFile);
      // fs.unlinkSync(opts.outputFile);
      console.info('Twitter upload finished.');
      cleanUpTmpFiles(opts.outputFile);
      if (error) {
        return callback(error,null);
      }
      else{
        return  callback(null, response);
      }
    });
  }

};

function ifPresentDeleteFile(path){
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

module.exports = tweetThatClip;