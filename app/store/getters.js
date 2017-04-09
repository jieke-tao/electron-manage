/**
 * Created by ty on 2017/4/4.
 */
const getters = {
    getSoftConfig(state) {
        return state.softConfig;
    },
    getManageList(state) {
        return state.softConfig.manageList;
    }
};

module.exports = getters;
