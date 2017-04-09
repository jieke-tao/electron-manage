/**
 * Created by ty on 2017/4/4.
 */

const mutations = {
    SETSOFTPW(state,oldPw, newPw) {
        if(oldPw == state.softConfig.softPw){
            state.softConfig.softPw = newPw;
        }
    },
    INITSOFT(state,data) {
        if(data == undefined){
            data = {
                createTime: new Date().valueOf(),
                lastStart: new Date().valueOf(),
                lastManage: "",
                softPw: "",
                manageType: "1",
                targetPath: "",
                manageList: []
            }
        }
        state.softConfig = data;
    },
    ADDMANAGE(state,dataObj) {
        state.softConfig.manageList.push({
            manageId: new Date().valueOf(),
            manageName: dataObj.name,
            createTime: new Date(),
            sortFolder: dataObj.source,
            TargetFolder: dataObj.target,
            remark: dataObj.remark,
            mainTag: []
        });
    }
};

module.exports = mutations;
