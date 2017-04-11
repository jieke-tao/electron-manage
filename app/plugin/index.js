/**
 * author      : denghm
 * createTime  : 2017/4/11 10:50
 * description : index
 */

import filter from './filter'
import prototype from './prototype'

const vuePlugin = {
    install: function (Vue, options) {
        filter(Vue);
        prototype(Vue);
    }
};

export default vuePlugin