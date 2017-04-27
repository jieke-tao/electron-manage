<template>
    <div :style="{ 'paddingLeft': deep * 10 + 'px' }">
        <div class="tree-box" v-for="(item,index) in data">
            <div class="tree-folder" :title="item.sourcePath" @click="switchChildOpen">
                <i v-if="item.ext == 'dir'" :class="['ivu-icon',open ? 'ivu-icon-android-folder-open' : 'ivu-icon-android-folder' ]"></i>
                <i v-else :class="['ivu-icon',computerIco(item.ext)]"></i>
                <span class="tree-name" v-text="item.name"></span>
                <div></div>
            </div>
            <tree v-if="item.children && item.children.length" v-show="open" :data="item.children" :deep="deep+1"></tree>
        </div>
    </div>
</template>
<script>


    export default{
        name: "tree",
        props: {
            deep: {
                type: Number,
                default: 0
            },
            data: Array
        },
        data(){
            return {
                open: this.deep < 1
            }
        },
        methods: {
            switchChildOpen() {
                this.open = !this.open;
            },
            computerIco(type) {
                let imgExt = ["jpg","png","gif","jpeg","psd"];
                let movieExt = ["mpg","mp4","avi","mov","wmv","3gp","mkv","flv","rmvb","f4v"];
                let musicExt = ["mp3","midi","wma","ogg","wav","flac","ape"];

                type = type.toLowerCase();
                if(imgExt.indexOf(type) !== -1){
                    return "ivu-icon-image";
                }else if(movieExt.indexOf(type) !== -1){
                    return  "ivu-icon-social-youtube";
                }else if(musicExt.indexOf(type) !== -1){
                    return "ivu-icon-music-note";
                }else {
                    return "ivu-icon-document";
                }
            }
        }
    }
</script>
<style>
    .tree-name{
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        max-width: 180px;
    }
    .tree-box{
        padding: 3px 0;
    }
    .tree-box i.ivu-icon{
        font-size: 14px;
        vertical-align: middle;
    }
    .tree-folder{
        white-space: nowrap;
    }
</style>
