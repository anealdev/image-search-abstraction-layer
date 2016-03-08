var https = require('https');
var http = require('http');
var url = require('url');
var html = '';
var dotenv = require('dotenv').config(); //load environment variables from .env
var port = process.env.PORT || 8080;
var infoArray = [];
var pageUrl, imageUrl, altText;
var options;

function addToArray(data, response){
    if(data == undefined){
        html = "No images found";
        return html;
    }
    else if(data.length >= 10){
        var length = 10;
    }
    else{
        var length = data.length;
    }
    for(var i = 0; i <= length; i++){
         pageUrl = "imgur.com/gallery/" + data[i].id;
         
         imageUrl = data[i].link;
         altText = data[i].title;
        var newArray = {"url": pageUrl, "image url": imageUrl, "alt text": altText};
         infoArray += JSON.stringify(newArray);
    }
    
    console.log(infoArray);
    html = infoArray;
   
}

function callback(response){
    var str = '';
    //append chunk of data to str
    response.on('data', function(chunk){
        str += chunk;
    });
    //whole response received, print to console
    response.on('end', function(){
        //console.log(str);
        var newData = JSON.parse(str);
        
        //console.log(newData.data.items); 
        addToArray(newData.data.items, response);
        
    });
}
var server = http.createServer(function(req, res){
    var origUrl = url.parse(req.url, true);
    var getOffset = url.parse(req.url, true).query;
    
    var pagination = getOffset.offset;
    var searchTerm = origUrl.pathname.slice(1) + "/path=" + pagination;
    //console.log(origUrl.pathname.slice(1));
    //console.log(pagination);
    options = {
    method: "GET",
    hostname: "api.imgur.com",
    path: '/3/gallery/t/' + searchTerm,
    headers: {
        "Content-Type" : "application/json",
        'Authorization': 'Client-ID ' + '39347fe2cdd277c' 
    }
};
https.request(options, callback).end();
res.end("<p>" + html + "</p>");
});
server.listen(port);
