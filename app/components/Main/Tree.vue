<template>
    <div :style="{ 'paddingLeft': deep * 10 + 'px' }">
        <div class="tree-box">
            <div class="tree-folder" :title="data.sourcePath" @click="focusItem(data)">
                <i v-if="data.ext == 'dir'"
                   :class="['ivu-icon',open ? 'ivu-icon-android-folder-open' : 'ivu-icon-android-folder' ]"></i>
                <i v-else :class="['ivu-icon',computerIco(data.type)]"></i>
                <span class="tree-name" v-html="data.name"></span>
            </div>
            <tree v-if="data.children && data.children.length"
                  v-for="item in data.children"
                  :key="item.createTime"
                  v-show="open"
                  :data="item"
                  :deep="deep+1"
                  @on-select="focusItem"></tree>
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
            data: Object
        },
        data(){
            return {
                open: this.deep < 1
            }
        },
        methods: {
            focusItem(item) {
                if(item.ext == "dir"){
                    this.open = !this.open;
                }else{
                    this.$emit("on-select",item);
                }
            },
            computerIco(type) {
                switch (type){
                    case "image":
                        return "ivu-icon-image";
                        break;
                    case "video":
                        return "ivu-icon-social-youtube";
                        break;
                    case "music":
                        return "ivu-icon-music-note";
                        break;
                    case "document":
                        return "ivu-icon-document-text";
                        break;
                    case "compress":
                        return "ivu-icon-social-buffer";
                        break;
                    case "others":
                        return "ivu-icon-document";
                        break;
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
        font-size: 15px;
        vertical-align: middle;
    }
    .tree-folder{
        white-space: nowrap;
    }
</style>
