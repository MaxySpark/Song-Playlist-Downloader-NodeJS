console.log("\nTHIS SCRIPT IS CREATED BY MAXYSPARK\n");
//modules
const ProgressBar = require('progress');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');


var searchItem,searchUrl;
var count = 0;
function readLineByLine(){
    if (!fs.existsSync('./downloads/')){
            fs.mkdirSync('./downloads/');
        }
    const rl = readline.createInterface({
    input: fs.createReadStream('song.txt')
    });
    var lines = [];
    var queries = [];
    var i = 1;
    rl.on('line', (line) => {
        lines.push(line);
        // console.log(lines);
    console.log('Seach Item ' + i + ' : ', line);
    i++;
    });
    rl.on('close',function(){
        // console.log(lines);
        lines.forEach(function(element){
            queries.push("https://www.youtube.com/results?search_query="+element.replace(/ /g, "+"));
        });
        download(queries[0],queries);
    });
}

function getMusic (songUrl,songName,songList) {
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
                if(allLinks[allLinks.length - 2].search("keepvid.com") != 7 ) {
                   var musicUrl = allLinks[allLinks.length - 5];
                } else {
                    var musicUrl = allLinks[allLinks.length - 6];
                }
                // console.log(musicUrl);
               console.log("\nNow Downloading : "+songName);
                var req = request({
                    method: 'GET',
                    uri : musicUrl
                });
                req.pipe(fs.createWriteStream('downloads/'+ songName.replace(/\//g,'') +'.mp3'));
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
                        // console.log('\n');
                        if(count<songList.length){
                            count++;
                            // console.log(songList.length);
                            // console.log(count);
                            if(size==0){
                                console.log(songName + "IS NOT DOWNLOADED!!!");
                            }
                            if(count<songList.length) {
                                download(songList[count],songList);  
                            } else {
                                console.log("\nDownload completed");
                            }
                        }
                    });
                });
            }
        });
}

function download(searchUrl,songList){

    request({
        url : searchUrl,
        gzip : true
    }, (err, res, body) => {
        if(err) throw err;
        else {
            var videoUrls = [];
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
            var mainUrl = "http://keepvid.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" 
                            + videoUrls[n].url.replace("/watch?v=",'');
            var songTitle = videoUrls[n].title;
            // console.log(mainUrl );
            getMusic(mainUrl,songTitle,songList);
                    

        }
    });
};

readLineByLine();