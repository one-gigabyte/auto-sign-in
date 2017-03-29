var cheerio = require('cheerio');
var nodegrass = require('nodegrass');
var url = "http://www.ssbest.top/auth/login";
function process(){
    console.log('start');
    console.log('url:'+url);
    nodegrass.get(url, function (data, status, headers) {
        console.log("html loaded...");
        console.log(data);
        var $ = cheerio.load(data);

    },'utf-8');
}
var app={
    run:process
}
module.exports=app;