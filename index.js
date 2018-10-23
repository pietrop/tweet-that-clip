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
const TweetVideo = require('./lib/TweetWithVideo/index.js');

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
    // Trim video 
    trimVideo({
        inputFile: opts.inputFile,
        outputFile: tmpOutputForTrim,
        inputSeconds: opts.inputSeconds,
        durationSeconds: opts.durationSeconds
      })
      .catch(error => console.log(error))
      // if audio create Waveform  
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
      // Burn captions - optional 
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
        return TweetVideo({
          credentials: opts.credentials,
          filePath: resFileToUpload,
          tweetText: opts.tweetText
        })
      })
      .catch(error => console.log(error))
      .then((res)=>{
        // TODO: consider adding logic to remove tmp files here 
        // cleanUpTmpFiles();
       return resolveTweetThatClip(res);
      })
      .catch((error) => {
        // rejecting main module promise
        return rejectTweetThatClip(error);
      })
      
    })
 
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
