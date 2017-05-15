/**
 * Created by ty on 2017/4/4.
 */

const electron = require('electron');
const configOperate = require('./config-operate');
const fs = require('fs');
const BrowserWindow = electron.BrowserWindow;

let eventList = {
    readConfigFile: function (event,path) {
        configOperate.readFromFile(path).then(function (result) {
            event.sender.send("readFileResult", result);
        });
    },
    saveConfigFile: function (event,path,obj) {
        configOperate.saveToFile(path, obj)
    },
    selectFolder: function (event) {
        let result = dialog.showOpenDialog({
            properties: ["openDirectory"]
        });
        event.sender.send("selectResult", result);
    },
    scanFolder: function (event, folderList) {
        let result = [];
        (folderList || []).forEach(function (folder) {
            result = result.concat(configOperate.scanFolder(folder,[]));
        },this);
        event.sender.send("scanFolderResult", result);
    },
    createNewWin: function (event,winOpt,broOpt) {
        broOpt.parent = global[broOpt.parent];
        let newWin = new BrowserWindow(broOpt);
        newWin.loadURL(`${global.url}#/${winOpt.urlPath}`);
        global[winOpt.name] = newWin;

        event.sender.send("createWinEnd");
    }
};

module.exports = eventList;
