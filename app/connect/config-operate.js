// /**
//  * Created by ty on 2017/4/2.
//  */
'use strict';
// const fs = require('fs');
const fs = require('fs');
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

module.exports = {
    saveToFile: saveToFile,
    readFromFile: readFromFile
};
