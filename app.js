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
        var mainUrl = "http://ssyoutube.com" + videoUrls[0].url;
        console.log(videoUrls );
    }
});