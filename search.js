var ProgressBar = require('progress');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var readlineSync = require('readline-sync');
var searchItem,searchUrl;
console.log("Enter The Video Name You Want To Search");
searchItem = readlineSync.question('Type The Video Name : ');
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
                $("#dl > .d-info > ul > li > a").each(function(){
                    allLinks.push($(this).attr('href'));
                });
                var musicUrl = allLinks[allLinks.length - 5];
                // console.log(musicUrl);
                console.log(songName);
                var req = request({
                    method: 'GET',
                    uri : musicUrl
                });
                req.pipe(fs.createWriteStream('downloads/'+ songName +'.mp3'));
                // req.pipe(out);
                req.on( 'response', function ( res ) {
                    var len = parseInt(res.headers['content-length'], 10);
                
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
                        console.log('\n');
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
            if(videoUrls[n].url.search("user")==1 || videoUrls[n].url.search("channel")==1) {
                console.log(n);
                n = n + 1;
                console.log(n);
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