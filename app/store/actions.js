/**
 * Created by ty on 2017/4/4.
 */
const actions = {
    initSoftConfig({commit}, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('INITSOFT',data);
                resolve()
            }, 200)
        });
    },
    addManage({commit}, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('ADDMANAGE',data);
                resolve()
            }, 200)
        });
    }
};

module.exports = actions;
