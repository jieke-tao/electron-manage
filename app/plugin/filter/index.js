/**
 * author      : denghm
 * createTime  : 2017/4/10 16:23
 * description : index
 */

export default function (Vue){
    Vue.filter("toString", function (value) {
        if(value){
            return value.toString();
        }else {
            return "";
        }
    });

    Vue.filter("formatDate", function (value,timeFlag,symbol) {
        let date;
        try{
            date = new Date(value);
        }catch (e){
            throw e;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let time = date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds();
        symbol = symbol || "-";
        let result = year + symbol + month + symbol + day;
        if(timeFlag){
            result += " " + time;
        }
        return result;
    })
};