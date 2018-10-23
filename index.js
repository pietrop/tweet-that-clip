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

/**
 * Trims and tweets a clip 
 * If it's an audio file it creates an animated waveform video 
 * If Captions are provided, for either video or audio, it burns them onto the video
 * It then sends the video to twitter.
 * @param {string} opts.inputFile - Path to audio or video file to trim
 * @param {string} opts.mediaType - Whether the input file is audio or video. Can be string 'audio' or 'video'. 
 * @param {string} opts.outputFile - Path to the mp4 video file for twitter
 * @param {string} opts.inputSeconds - Seconds, or a timestamp string (with format `[[hh:]mm:]ss[.xxx]`)
 * @param {string} opts.durationSeconds -  Up to 2min duration, In seconds or a timestamp string (with format `[[hh:]mm:]ss[.xxx]`)
 * @param {string} opts.tweetText - Twitter text status  280 characters limit.
 * @param {string} opts.tmpDir -  tmp directory for creating intermediate clips when processing media
 * @param {string} opts.ffmpegBin - Path to ffmpeg path binary, eg from ffmpeg-static-electron
 * @param {string=} opts.srtFilePath - optional path to caption file to burn onto the video 
 * @param {string=} opts.credentials - Twitter credentials objects, Optional
 * @param {string=} opts.credentials.consumerKey - User specific Twitter credentials
 * @param {string=} opts.credentials.consumerSecret - User specific Twitter credentials
 * @param {string=} opts.credentials.accessToken - Twitter app access credentials
 * @param {string=} opts.credentials.accessTokenSecret - Twitter app access credentials
 */
function tweetThatClip(opts) {
  let fileExtension = path.extname(opts.outputFile);
  let fileNameBase = path.basename(opts.outputFile, fileExtension);
  let tmpOutputForTrim = `${opts.tmpDir}/${fileNameBase}.trimmed${fileExtension}`;
  let tmpOutputForWave = `${opts.tmpDir}/${fileNameBase}.wave${fileExtension}`;
  // There are captions and is a video 
  if(opts.srtFilePath === undefined && opts.mediaType ==='video'){
    tmpOutputForTrim = opts.outputFile;
  }
  // There are no captions and is an audio  
  if(opts.srtFilePath === undefined && opts.mediaType ==='audio'){
    tmpOutputForWave = opts.outputFile;
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
      // Burn captions - optional, if srt provided 
      .then((resReadyToBurnFilePath)=>{
        // if captions not provided don't attempt to burn them
        if(opts.srtFilePath !== undefined){
          return  burnCaptions({
            inputFile: resReadyToBurnFilePath,
            outputFile: opts.outputFile,
            srtFilePath: opts.srtFilePath,
            ffmpegBin: opts.ffmpegBin
          })
        }else{
          return resReadyToBurnFilePath;
        }
        
      })
      .catch(error => console.log(error))
      // Tweet clip  
      .then((resFileToUpload)=>{
         return TweetVideo({
          credentials: opts.credentials,
          filePath: resFileToUpload,
          tweetText: opts.tweetText
        })
        .then((resTwitter)=>{
          let result ={
            outputFile: resFileToUpload,
            resTwitter: resTwitter
          }
          return result;
        })
        .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
      .then((res)=>{
        // TODO: consider adding logic to remove tmp files here 
        cleanUpTmpFiles();
         return resolveTweetThatClip(res)
      })
      .catch((error) => {
        // rejecting main module promise
        return rejectTweetThatClip(error);
      })
    })
 
  /**
   * Helper function to remove tmp files used to create segment
   * to upload to twitter
   */
  function cleanUpTmpFiles(){
    // There are captions and is a video
    if(opts.srtFilePath !== undefined && opts.mediaType === 'video'){
      ifPresentDeleteFile(tmpOutputForTrim);
    }
    // There are no captions and is a audio
    if(opts.srtFilePath === undefined && opts.mediaType ==='audio'){
      ifPresentDeleteFile(tmpOutputForTrim);
    }
    // There are captions and is a audio
    if(opts.srtFilePath !== undefined && opts.mediaType === 'audio'){
      ifPresentDeleteFile(tmpOutputForTrim);
      ifPresentDeleteFile(tmpOutputForWave);
    }
  }

  /**
   * Helper function to delete file
   * Check if file is present before deleting 
   * @param {string} path - path to file to delete
   */
  function ifPresentDeleteFile(path){
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }
  
}
module.exports = tweetThatClip;
