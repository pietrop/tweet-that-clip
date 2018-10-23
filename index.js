/**
 * Trims clip, and converts to twitter video specs 
 * Tweets clip and text status
 * see specs 
 * https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
 */
const path = require('path');
const fs = require('fs');
const trimVideo = require('./lib/trim/index.js');
const audioToVideoWaveForm = require('./lib/audio-to-video-waveform/index.js');
const burnCaptions  = require('./lib/burn-captions/index.js');
const TweetWithVideo = require('./lib/TweetWithVideo/index.js');

// TODO: needs refactoring and simplifying 
function tweetThatClip(opts) {
  let fileExtension = path.extname(opts.outputFile);
  let tmpOutputForTrim = `${opts.inputFile}.trimmed${fileExtension}`;
  let tmpOutputForWave = `${opts.outputFile}.wave${fileExtension}`;
  let tmpOutputTwitterVideoSpecs = `${opts.outputFile}.twitterspec${fileExtension}`;
  let tmpOutputForBunt = `${opts.outputFile}.burnt${fileExtension}`;
  // if there is no SRT file, then skip burning captions for audio
  if(opts.srtFilePath === undefined && opts.mediaType ==='audio'){
    tmpOutputForBunt = opts.outputFile;
  }
  // if there is no SRT file, then skip burning captions for video
  if(opts.srtFilePath === undefined && opts.mediaType ==='video'){
    tmpOutputForTrim = opts.outputFile;
  }
  return new Promise((resolveTweetThatClip, rejectTweetThatClip)=>{
    // trim video 
    trimVideo({
        inputFile: opts.inputFile,
        outputFile: tmpOutputForTrim,
        inputSeconds: opts.inputSeconds,
        durationSeconds: opts.durationSeconds
      })
      .catch(error => console.log(error))
      // if audio create wave form waveform 
      .then((resTrimmedFilePath)=>{
        if(opts.mediaType ==='audio'){
        return audioToVideoWaveForm({
            audioSrc: resTrimmedFilePath,
            outputFile: tmpOutputForWave
          })
        }else{
          return resTrimmedFilePath;
        }
      })
      .catch(error => console.log(error))
      // burn captions
      .then((resReadyToBurnFilePath)=>{
        // if captions not provided don't attempt to burn them
        if(opts.srtFilePath !== undefined){
          return  burnCaptions({
            inputFile: resReadyToBurnFilePath,
            srtFilePath: opts.srtFilePath,
            outputFile:  tmpOutputForBunt,
            ffmpegBin: opts.ffmpegBin
          })
        }else{
          return resReadyToBurnFilePath;
        }
        
      })
      .catch(error => console.log(error))
      // Tweet clip  
      .then((resFileToUpload)=>{
        console.log(resFileToUpload)
        return tweetClipHelper({
          credentials: opts.credentials,
          outputFile: resFileToUpload,
          tweetText: opts.tweetText
        })
      })
      .catch(error => console.log(error))
      .then((res)=>{
        console.log(res)
        // resolving main module promise
        resolveTweetThatClip(res);
      })
      .catch((error) => {
        console.log(error);
        // rejecting main module promise
        rejectTweetThatClip(error);
      })
      
    })
  
    // Helper functions 

  // wrapped tweet module into a promise, if works, move into tweet moodule
  function tweetClipHelper(opts){
  // TODO: this could be refactored? to be a bit cleaner
    return new Promise((resolve, reject)=>{
      let videoTweet = new TweetWithVideo({
        // if they are not set is just passed as undefined. for now keeping logic of deciding which credentials to use use within the module, while figure out cleaner solution.
        credentials: opts.credentials,
        file_path: opts.outputFile,
        tweet_text: opts.tweetText
      }, (error, response)=>{
        // Deleting the trimmed clip 
        // console.log(opts.outputFile);
        // fs.unlinkSync(opts.outputFile);
        console.info('Twitter upload finished.');
        // cleanUpTmpFiles(opts.outputFile);
        if (error) {
          // return callback(error,null);
          reject(error);
        }
        else{
          resolve(response);
          // return  callback(null, response);
        }
      });
    })
  }


  /**
   * Helper function to remove tmp files used to create segment
   * to upload to twitter
   * @param {string} final  - expects path to final clip sent to twitter
   */
  function cleanUpTmpFiles(final){
    ifPresentDeleteFile(tmpOutputForTrim);
    ifPresentDeleteFile(tmpOutputForWave);
    ifPresentDeleteFile(tmpOutputForBunt);
    // TODO: final perhaps should not be deleted or should give option to keep?
    // ifPresentDeleteFile(final);
  }

  function ifPresentDeleteFile(path){
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }
  
}
module.exports = tweetThatClip;
