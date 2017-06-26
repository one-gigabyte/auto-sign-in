var cheerio = require('cheerio');
var superagent = require("superagent");
var events = require("events");
var fs = require('fs');
var emitter = new events.EventEmitter();
var email = "chchcome@163.com";
var passwd = "cheng2016";
var remember_me = "week";
var url = "https://www.ssbest.top/auth/login";
var checkinUrl="https://www.ssbest.top/user/checkin";
function process(){
    console.log('start');
    var seconds = Math.round(Math.random()*3600);
    console.log("wait "+seconds+"s");
    sleep(seconds*1000).then(function(){main();});

}
function sleep(delay){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,delay);
    });
}
function main(){
    console.log('url:'+url);
    var cookie = readCookie();
    if(cookie){
        console.log("use cookie:\n"+cookie);
    } 
    //emitter.on("logined", checkin);
    //login();
    get(cookie);
}
function get(cookie){
    superagent.get("https://www.ssbest.top/user")
    .set("Cookie",cookie)
    .end(function (err, res) {
        if (res.ok) {
            var html = res.text
            console.log('got:' + res.text);
            var $ = cheerio.load(html);
            var form=$(".form-group.has-feedback");
            if(form&&form.length){
                console.log("need to login");
                login();
            }
            else{
                var btn = $("#checkin").not(".disabled");
                if(btn&&btn.length){
                    checkin(cookie);
                }
            }
        }
    });
}
function login(){
    superagent.post(url)
    .send({"email":"chchcome@163.com",
        "passwd":"cheng2016",
        "remember_me":"week"})
    .set('Accept', 'application/json')
    .set("x-requested-with","XMLHttpRequest")
    .set("content-type","application/x-www-form-urlencoded; charset=UTF-8")
    .set("user-agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36")
    .end(function (err, res) {
        if (res.ok) {
            console.log('got:' + JSON.stringify(res.body));
            if(res.body.ret===1){
                console.log("login successfully,begin to singin");
                var cookie=res.headers["set-cookie"];
                debugger;
                console.log("cookie:"+cookie);
                //emitter.emit("logined",cookie);
                var cookie=saveCookie(cookie);
                get(cookie);
                //checkin(cookie);
            }
        } else {
            console.log('error:' + res.text);
        }
    });
}
function checkin(cookie){
    superagent.post(checkinUrl)
    .set('Accept', 'application/json')
    .set("content-type","application/x-www-form-urlencoded; charset=UTF-8")
    .set("user-agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36")
    .set("Cookie", cookie)
    .end(function(err,res){
        if (res.ok) {
            console.log('got:' + JSON.stringify(res.body));
            } else {
            console.log('error:' + res.text);
        }
    });
}
function saveCookie(cookie){
    var array = cookie.toString().replace('HttpOnly,','').split(";");
    for(i in array){
        if(array[i]&&array[i].indexOf("sid")!==-1){
            cookie=array[i].toString().trim();
            break;
        }
    }
    fs.writeFileSync('./data/cookie',cookie);
    return cookie;
}
function readCookie(){
    var data = fs.readFileSync('./data/cookie', 'utf8');
    return data;
}
var app={
    run:process
}
module.exports=app;