/**
 * Created by ty on 2017/4/4.
 */

const configOperate = require('./config-operate');

let eventList = {
    // initConfig: function (event,data) {
    //     configOperate.readFromFile('softConfig.config').then(function (result) {
    //         if(!result.state){
    //             configOperate.saveToFile("softConfig.config", data);
    //         }
    //     });
    // },
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
