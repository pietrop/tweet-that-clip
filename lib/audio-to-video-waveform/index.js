/**
 * converting this command to fluent ffmpeg
 * to generate video of audio wave form from audio file
 * 
 * ffmpeg -i BodyOnTheMoor-20160610-Episode3Poison.mp3 -filter_complex "[0:a]showwaves=s=1920x1080:mode=line,format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy output-wave-test.mp4
 * 
 * Could also add support for image in background example https://youtu.be/zKYzJ_bEJVo see example.
 */
const ffmpeg = require('fluent-ffmpeg');

function audioToVideoWaveForm(opts){
    if(opts.ffmpegBin !== undefined){
        ffmpeg.setFfmpegPath(opts.ffmpegBin)
    }
    // Using promises with fluent-ffmpeg https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/710
    return new Promise((resolve, reject)=>{
        ffmpeg(opts.audioSrc)
            .output(opts.outputFile)
            .withVideoCodec('libx264')
            // wave form reference https://trac.ffmpeg.org/wiki/Waveform
            // https://ffmpeg.org/ffmpeg-filters.html#showwaves
            // TODO: colour, and mode could be optional parameter, for mode eg line, point,p2p,cline.
            .complexFilter('[0:a]showwaves=s=1920x1080:colors=Blue:mode=cline,format=yuv420p[v]')
            .outputOption(['-map [v]','-map', '0:a'])
            .audioCodec('copy')
            // when done executing returning output file name to callback
            .on('end', function() { 
                resolve(opts.outputFile); 
            })
            .on('error',(er)=>{
                console.error(er);
                reject(er);
            })
            .run();
    }) 
}

module.exports =  audioToVideoWaveForm;
