/**
 * Created by ty on 2017/4/4.
 */

const configOperate = require('./config-operate');

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
    }
};

module.exports = eventList;
