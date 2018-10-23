// Helper functions 
// TODO: move tweetClipHelper to tweetWithVideo module
// wrapped tweet module into a promise, if works, move into tweet moodule
const TweetWithVideo = require('./TweetWithVideo.js');

function tweetClipHelper(opts){
// TODO: this could be refactored? to be a bit cleaner
    return new Promise((resolve, reject)=>{
    let videoTweet = new TweetWithVideo({
        // if they are not set is just passed as undefined. for now keeping logic of deciding which credentials to use use within the module, while figure out cleaner solution.
        credentials: opts.credentials,
        file_path: opts.filePath,
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

module.exports = tweetClipHelper;