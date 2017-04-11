/**
 * author      : denghm
 * createTime  : 2017/4/11 10:45
 * description : index
 */

export default function (Vue){
    Vue.getUrlKey = function(url){
        return new Promise((resolve,reject) => {
            let search = url.split("?")[1];
            let searchArr = search ? search.split("&") : [];
            let result = {};
            search.forEach(function(v){
                let temp = v.split("=");
                result[temp[0]] = temp[1];
            });
            resolve(result);
        });
    }
}