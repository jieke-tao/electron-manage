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
            lastOpenTime: new Date(),
            sortFolder: dataObj.source,
            targetFolder: dataObj.target,
            remark: dataObj.remark,
            mainTag: []
        });
    },
    DELETEMANAGE(state,index) {
        state.softConfig.manageList.splice(index,1);
    }
};

module.exports = mutations;
