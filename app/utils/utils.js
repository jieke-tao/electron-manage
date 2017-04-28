/**
 * author      : denghm
 * createTime  : 2017/4/28 9:42
 * description : utils
 */

function computeFileType(extString) {
    let imgExt = ["jpg","png","gif","jpeg","psd"];
    let movieExt = ["mpg","mp4","avi","mov","wmv","3gp","mkv","flv","rmvb","f4v"];
    let musicExt = ["mp3","midi","wma","ogg","wav","flac","ape"];
    let documentExt = ["txt","pdf","doc","xls","ppt","docx","xlsx","pptx"];
    let compressExt = ["rar","zip","exe"];

    extString = extString.toLowerCase();
    if(imgExt.indexOf(extString) !== -1){
        return "image";
    }else if(movieExt.indexOf(extString) !== -1){
        return  "video";
    }else if(musicExt.indexOf(extString) !== -1){
        return "music";
    }else if(documentExt.indexOf(extString) !== -1){
        return "document";
    }else if(compressExt.indexOf(extString) !== -1){
        return "compress";
    }else {
        return "others";
    }
}

module.exports = {
    computeFileType
};