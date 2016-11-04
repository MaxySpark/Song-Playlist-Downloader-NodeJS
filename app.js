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

function getMusic (songUrl) {
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
                allLinks[allLinks.length - 5 - 1];
                console.log(allLinks[allLinks.length - 5]);
            }
        });
}

request({
    url : searchUrl,
    gzip : true
}, (err, res, body) => {
    if(err) throw err;
    else {
        var $ = cheerio.load(body);
        $(".yt-lockup-title > a").each(function(){
            var urlCurrent = {
                url : $(this).attr('href'),
                title : $(this).attr('title')
            }
            videoUrls.push(urlCurrent);
        });
        var mainUrl = "http://keepvid.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" + videoUrls[0].url.replace("/watch?v=",'');
        // console.log(mainUrl );
        getMusic(mainUrl);
                

    }
});