const colors = require('colors');
console.log("\n ******************************************".rainbow.bold);
console.log(" **                                      **".rainbow.bold);
console.log("****".rainbow.bold + ("THIS SCRIPT IS CREATED BY: ").red.bold + "MAXYSPARK****".rainbow.bold);
console.log(" **                                      **".rainbow.bold);
console.log(" ******************************************".rainbow.bold);
var ProgressBar = require('progress');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var readlineSync = require('readline-sync');
var searchItem,searchUrl;
console.log("Enter The Song Name You Want To Search\n");
searchItem = readlineSync.question('Type The Song Name : ');
searchItem = searchItem.replace(/ /g, "+");
// searchUrl = "https://www.youtube.com/results?sp=CAM%253D&q=" + searchItem;
searchUrl = "https://www.youtube.com/results?search_query="+searchItem;

var videoUrls = [];

function getMusic (songUrl,songName) {
    request({
            url : songUrl,
            gzip : true
        }, (err, res, body)=> {
            if(err) throw err;
            else {
                var $ = cheerio.load(body);
                var allLinks = [];
                $("#dl > .d-info2 > dl >dd >a").each(function(){
                    allLinks.push($(this).attr('href'));
                });
                if(allLinks[allLinks.length - 2].search("keepvid.com") != 7 ) {
                   var musicUrl = allLinks[allLinks.length - 3];
                } else {
                    var musicUrl = allLinks[allLinks.length - 2];
                }
                // console.log(musicUrl);
                console.log("\nNow Downloading : ".blue.bold+songName.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\[|\]|\'/g,'').replace(/lyrics/g,'').replace(/Official Video/g,'').yellow.bold);
                var req = request({
                    method: 'GET',
                    uri : musicUrl
                });
                req.pipe(fs.createWriteStream('downloads/'+ songName.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\[|\]|\'/g,'').replace(/lyrics/g,'').replace(/Official Video/g,'') +'.m4a'));
                // req.pipe(out);
                req.on( 'response', function ( res ) {
                    var len = parseInt(res.headers['content-length'], 10);
                    var size = (len/1024)/1024;
                    console.log("File Size : "+parseFloat(size).toFixed(2)+" MB");
                    console.log();
                    var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
                        complete: '=',
                        incomplete: ' ',
                        width: 20,
                        total: len
                    });
                    
                    res.on('data', function (chunk) {
                        bar.tick(chunk.length);
                    });
                    
                    res.on('end', function () {
                        if(size==0){
                                console.log("ALERT!!! ALERT!!!\n".red.bold)
                                console.log(songName.cyan.bold + " IS NOT DOWNLOADED!!!".red.bold);
                            } else {
                                console.log("\nDownload completed\n".green.bold);
                            }
                    });
                });
            }
        });
}

request({
    url : searchUrl,
    gzip : true
}, (err, res, body) => {
    if(err) throw err;
    else {
        if (!fs.existsSync('./downloads/')){
            fs.mkdirSync('./downloads/');
        }
        var n = 0;
        var z = 0;
        var $ = cheerio.load(body);
        $(".yt-lockup-title > a").each(function(){
            var urlCurrent = {
                url : $(this).attr('href'),
                title : $(this).attr('title')
            }
            videoUrls.push(urlCurrent);
        });
        for(z=0;z<videoUrls.length;z++) {
            if(videoUrls[n].url.search("user")==1 || videoUrls[n].url.search("channel")==1 || videoUrls[n].url.search("googleads.g")==8) {
                // console.log(n);
                n = n + 1;
                // console.log(n);
            } else {
                break;
            }
        }
        
        var mainUrl = "http://keepvid.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" + videoUrls[n].url.replace("/watch?v=",'');
        var songTitle = videoUrls[n].title;
        // console.log(mainUrl );
        getMusic(mainUrl,songTitle);
                

    }
});
