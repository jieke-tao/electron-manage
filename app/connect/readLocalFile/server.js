/**
 * author      : denghm
 * createTime  : 2017/5/3 14:03
 * description : server
 */


const fs = require("fs");
const http = require("http");
const url = require("url");
import { router, mime } from './config';


let server = http.createServer(function (request, response) {

    let pathname = url.parse(request.url,true);
    let queryObj;
    let queryPath;
    let queryType;
    if(pathname.pathname.substr(1) !== router){
        return response.end("this port is used for get local file only");
    }else {
        queryObj = pathname.query;
        queryPath = queryObj.path;
        queryType = queryObj.type;
    }

    if(queryType == "video" || queryType == "audio"){
        streamLoad.apply(this,[request,response,queryObj]);
    }else {
        objectLoad.apply(this,[request,response,queryObj]);
    }
});

//流式加载
function streamLoad(request,response,queryObj) {
    let queryPath = queryObj.path;
    fs.stat(queryPath, function (err,stats) {
        if(err) {
            if (err.code === 'ENOENT') {
                return response.statusCode = 404;
            }
            response.end(err);
        } else {
            let range = request.headers.range;
            if (!range) {
                // 416 Wrong range
                return response.statusCode = 416;
            }
            let positions = range.replace(/bytes=/, "").split("-");
            let start = parseInt(positions[0], 10);
            let total = stats.size;
            let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            let chunksize = (end - start) + 1;

            response.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": mime[queryObj.ext]
            });
            let stream = fs.createReadStream(queryPath, { start: start, end: end })
                .on("open", function() {
                    stream.pipe(response);
                })
                .on("error", function(err) {
                    response.end(err);
                });
        }
    });
}

//一次性加载
function objectLoad(request,response,queryObj) {
    let queryPath = queryObj.path;
    fs.stat(queryPath, function (err,stats) {
        if(err) {
            if (err.code === 'ENOENT') {
                return response.statusCode = 404;
            }
            response.end(err);
        } else {
            fs.readFile(queryPath, function (err, data) {
                if (err) {
                    response.end(err);
                }else {
                    response.writeHead(200, {
                        "Content-Type": mime[queryObj.ext]
                    });
                    response.end(data);
                }
            });
        }
    });
}


module.exports = {
    server
};
