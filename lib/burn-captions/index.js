/**
*  
* you need a version of ffmpeg with --enable-libass eg from `ffmpeg-static-electron`
*/
const ffmpeg = require('fluent-ffmpeg');

function burnCaptions(options, cb){
    // TODO: Font type, and font size could be passed in as optional params
    let subtitleFilter = `subtitles=${options.srtFilePath}:force_style='FontSize=34,FontName=DejaVu Serif,OutlineColour=&H80000000,BorderStyle=3,Outline=1,Shadow=0'`;
    // setting optional ffmpeg bin path. 
    if(options.ffmpegPath !== undefined){
        ffmpeg.setFfmpegPath(options.ffmpegPath)
    }
    ffmpeg(options.videoSrc)
        // https://stackoverflow.com/questions/25870169/how-to-set-background-to-subtitle-in-ffmpeg
        // .complexFilter('drawbox=w=iw:h=24:y=ih-28:t=max:color=black@0.4')
        .videoFilters(subtitleFilter)
        .output(options.outputFile)
        .on('end', function() { 
            // console.log(`Done processing ${options.outputFileName}`);
            // optional callback
            // console.log('done processing', options.outputFile);
            if(cb){cb(options.outputFile)}else{return options.outputFile};
        })
        .run();
}

module.exports = burnCaptions;
