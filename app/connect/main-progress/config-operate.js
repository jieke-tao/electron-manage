// /**
//  * Created by ty on 2017/4/2.
//  */
'use strict';
// const fs = require('fs');
const fs = require('fs');
const path = require('path');
const basePath = process.cwd()+"/Config";

const saveToFile =  (filePath, jsonData, callback) => {
    let fileName = basePath + "/" + filePath;
    let writeData = typeof jsonData == "object" ? JSON.stringify(jsonData) : jsonData;
    try {
        fs.writeFileSync(fileName,writeData, 'utf8',function (err) {
            if(err){
                throw err;
            }else if(callback){
                callback();
            }
        });
    }
    catch (err){
        console.log(err);
        fs.mkdir(basePath, function (err) {
            if(err){
                throw err;
            }else {
                saveToFile(filePath,jsonData,callback)
            }
        });
    }
};

const readFromFile = (filePath,callback) => {
    let fileName = basePath + "/"  + filePath;
    return new Promise((resolve) => {
        fs.stat(fileName,function (err,stat) {
            if(err){
                resolve({
                    state: 0,
                    data: err
                });
            }else {
                let data = fs.readFileSync(fileName,'utf-8');
                resolve({
                    state: 1,
                    data: JSON.parse(data)
                });
            }
        });
    })
};

const scanFolder = (filePath,result) => {
    let pathCheck = "";
    try {
        pathCheck = fs.statSync(filePath);
    }catch (err){
        console.log(err);
        pathCheck = -1;
    }
    selectResult(pathCheck);

    function selectResult(pathCheck) {
        if(pathCheck === -1){
            result.push({
                name: path.basename(filePath),
                type: -1,
                size: -1,
                sourcePath: filePath,
                parentPath: "",
                ext: -1,
                createTime: -1,
                isDelete: 1
            });
        }else {
            if(pathCheck.isFile()){
                result.push({
                    name: path.basename(filePath),
                    type: "file",
                    size:  pathCheck.size,
                    sourcePath: filePath,
                    parentPath: path.dirname(filePath),
                    ext: path.extname(filePath).substr(1),
                    createTime: pathCheck.birthtime,
                    isDelete: 0
                });
            }else {
                result.push({
                    name: path.basename(filePath),
                    type: "dir",
                    size:  pathCheck.size,
                    sourcePath: filePath,
                    parentPath: path.dirname(filePath),
                    ext: "dir",
                    createTime: pathCheck.birthtime,
                    isDelete: 0
                });
                let childFile = fs.readdirSync(filePath);
                childFile.forEach(v => {
                    scanFolder(path.join(filePath,v),result);
                });
            }
        }
    }
    return result;
};

module.exports = {
    saveToFile,
    readFromFile,
    scanFolder
};
