/**
*  
* you need a version of ffmpeg with --enable-libass eg from `ffmpeg-static-electron`
*/
const spawn = require('child_process').spawn;

function burnCaptions(opts){
    // return a promise 
    return new Promise((resolve, reject)=>{
        // TODO: Font type, and font size could be passed in as optional params
        let subtitleFilter = `subtitles=${opts.srtFilePath}:force_style='FontSize=34,FontName=DejaVu Serif,OutlineColour=&H80000000,BorderStyle=3,Outline=1,Shadow=0'`;
        // had issues wrapping fluent-ffmpeg in a promise using videoFilters, so using spawn instead
        // https://stackoverflow.com/questions/23188782/node-fluent-ffmpeg-stream-output-error-code-1
        const ffmpeg = spawn(`${opts.ffmpegBin}`, ['-i', `${opts.inputFile}`, '-vf', subtitleFilter, `${opts.outputFile}`,'-y']);

        ffmpeg.on('error', function(err) {
            console.log('Burn captions module, error: ' + err);
            reject(err);
        });

        ffmpeg.on('close', function () {
            // console.log('file has been converted successfully');
            resolve(opts.outputFile);
        });
    })
}

module.exports = burnCaptions;
