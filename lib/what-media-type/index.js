const ffmpeg = require('fluent-ffmpeg');

/**
 * NOT In use - eg MP3 with poster image, gets returned as video type rather audio
 * need more reliable way to test for type. eg presence of fps?
 * 
 * Given a media file path, it returns the type, letting you know whether is audio, video or subtitle file
 * @param {string} options.mediaSrc - path to the media file, audio, video, subtitles file(srt)
 * @param {string} options.ffprobeBin - optional path to ffprobe binary, if not provide it uses system one if present
 * @param {function} cb - callback function to return result of the media type, eg 'audio', 'video', 'subtitle'
 */
function whatMediaType(options, cb){
    // Optional set ffprobe path
    if(options.ffprobeBin !== undefined){
        ffmpeg.setFfprobePath(options.ffprobeBin);
    }
    ffmpeg.ffprobe(options.mediaSrc, function(err, metadata) {
        if(metadata.streams.length === 1){
           if(metadata.streams[0].codec_type ==='audio'){
            //    console.log('audio');
               if(cb){cb('audio')}else{return 'audio'}
           }
           if(metadata.streams[0].codec_type ==='subtitle'){
                // console.log('subtitle');
                if(cb){cb('subtitle')}else{return 'subtitle'}
            }
            // edge case video without audio stream?
        }
        else if(metadata.streams.length > 1) {
            // it has more then one stream, if it has at least one video stream
            // then is a video file
           let videoStream = metadata.streams.filter((stream)=>{
              return stream.codec_type ==='video';
           })
           if(videoStream.length>=1){
                // console.log('video');
                if(cb){cb('video')}else{return 'video'}
           }
        }   
    });
}
module.exports = whatMediaType;

// function isAudio(audioSrc){
//     whatMediatype({
//         mediaSrc:audioSrc
//     })
//     // bla,bla,bla callback return true 
// }
// module.exports.isAudio = isAudio;
