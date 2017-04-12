<template>
    <div class="cleanfix root-node" @click="rootClick">
        <div class="menu-left" :style="{'marginLeft': menuBarShow ? '0' : '-30%'}">
            <i class="expand-ico" v-show="!menuBarShow" @click="menuBarShow = true"></i>
            <ul class="menu-bar cleanfix">
                <li title="收起侧边栏" @click="menuBarShow = false">
                    <Icon size="20" type="ios-arrow-back"></Icon>
                </li>
                <li title="过滤" @click.stop="menuBarClick(2)" :class="menuBarActive === 2 ? 'active' : ''">
                    <Icon size="20" type="funnel"></Icon>
                    <div class="extend-box filter-box" @click.stop="" v-show="menuBarActive == 2">
                        <i class="nav-ico"></i>
                        <Input v-model="searchKey" icon="ios-search" placeholder="输入关键字进行过滤"></Input>
                        <Checkbox-group v-model="searchType">
                            <Checkbox label="1">图片</Checkbox>
                            <Checkbox label="2">音频</Checkbox>
                            <Checkbox label="3">视频</Checkbox>
                            <Checkbox label="4">其他</Checkbox>
                            <Checkbox label="5">文件夹</Checkbox>
                        </Checkbox-group>
                    </div>
                </li>
                <li title="切换菜单面板" @click="showSystemSetting = !showSystemSetting" :class="{'active': showSystemSetting}">
                    <Icon size="20" type="arrow-swap"></Icon>
                </li>
                <li title="内容显示" @click.stop="menuBarClick(4)" :class="menuBarActive === 4 ? 'active' : ''">
                    <Icon size="20" type="android-folder-open"></Icon>
                    <div class="extend-box displayType-box" @click.stop="" v-show="menuBarActive === 4">
                        <i class="nav-ico"></i>
                        <Radio-group v-model="structureType" vertical>
                            <Radio label="1">仅文件</Radio>
                            <Radio label="2">仅文件夹</Radio>
                            <Radio label="3">文件夹 + 文件</Radio>
                        </Radio-group >
                    </div>
                </li>
            </ul>
            <div v-show="showSystemSetting" class="system-menu">
                <dl class="menu-list">
                    <dt>
                        <Icon size="16" type="navicon-round"></Icon>
                        菜单
                    </dt>
                    <dd>切换管理层</dd>
                    <dd>更新文档</dd>
                    <dd>归档</dd>
                    <!--<hr />-->
                    <dd>管理层编辑</dd>
                    <dd>整理设置</dd>
                    <dd>标签设置</dd>
                    <dd>软件设置</dd>
                </dl>
                <dl class="menu-list">
                    <dt>
                        <Icon type="help-circled"></Icon>
                        帮助
                    </dt>
                    <dd>软件文档</dd>
                    <dd>关于</dd>
                </dl>
                <dl class="menu-list">
                    <dt>
                        <Icon type="ios-keypad"></Icon>
                        其他
                    </dt>
                    <dd>退出</dd>
                </dl>
            </div>
            <div v-show="!showSystemSetting" class="content-detail">
                <dl class="menu-list">
                    <dt>
                        <Icon size="16" type="folder"></Icon>
                        文件夹名
                    </dt>
                    <dd>文件名1</dd>
                    <dd>文件名2</dd>
                    <dd>文件名3</dd>
                    <dd>文件名4</dd>
                    <dd>文件名5</dd>
                    <dd>文件名6</dd>
                    <dd>文件名7</dd>
                </dl>
            </div>
        </div>
        <div class="content-right"></div>
    </div>

</template>
<script>

    import store from 'vuex'
    import { ipcRenderer as ipc } from 'electron'

    export default{
        data () {
            return {
                manageId: "",
                menuBarShow: true,
                menuBarActive: "",
                showSystemSetting: false,
                structureType: 3,
                searchKey: "",
                searchType: ["1","2","3","4","5"]
            }
        },
        methods: {
            rootClick() {
                this.menuBarActive = "";
            },
            menuBarClick(num) {
                if(this.menuBarActive == num){
                    this.menuBarActive = "";
                }else {
                    this.menuBarActive = num;
                }
            },
            softConfig() {
                let that = this;
                let promise;
                ipc.once("readFileResult", function (e,result) {
                    if(result.state == 1){
                        promise = that.$store.dispatch("initSoftConfig", result.data);
                    }else {
                        promise = that.$store.dispatch("initSoftConfig");
                        ipc.send("saveConfigFile","softConfig.config",that.$store.getters.getSoftConfig);
                    }
                    promise.then(function(){
                        that.manageArr = that.$store.getters.getManageList;
                    });
                });
                ipc.send("readConfigFile","softConfig.config");
            }
        },
        beforeRouteEnter(to, from, next) {
            let id = to.query.manageId;
            if(id){
                next(function(vm){
                    vm.manageId = id;
                });
            }
        },
        mounted: function () {
        }

    }
</script>
<style scoped>
    .root-node{
        display: flex;
    }
    .menu-left{
        width: 30%;
        height: 100%;
        float: left;
        background-color: #f5f5f5;
        border-right: 1px solid #eee;
        transition: all 200ms;
        position: relative;
    }
    .menu-left .expand-ico{
        content: "";
        display: inline-block;
        width: 12px;
        height: 89px;
        background: url("../asset/img/expand-menu.png") center no-repeat;
        position: absolute;
        right: -12px;
        top: 50%;
        margin-top: -46px;
        cursor: pointer;
    }
    .menu-left .expand-ico:hover{
        background: url("../asset/img/expand-menu-hover.png") center no-repeat;
    }
    .content-right{
        width: 70%;
        height: 100%;
        float: left;
        flex: 1;
    }
    .menu-bar{
        border-bottom: 1px solid #eee;
        position: relative;
    }
    .menu-bar > li{
        width: 25%;
        float: left;
        text-align: center;
        padding: 8px 0 6px;
        cursor: pointer;
        border-left: 1px solid #eee;
    }
    .menu-bar > li:hover > i,
    .menu-bar > li.active > i{
        color: #2baee9;
    }
    .menu-bar > li:first-child{
        border-left: 0;
    }
    .system-menu,
    .content-detail{
        padding: 15px 20px;
    }
    .menu-list{
        font-size: 13px;
        margin-bottom: 10px;
        padding-bottom: 7px;
        border-bottom: 1px solid #ddd;
    }
    .menu-list:last-child{
        border-bottom: none;
    }
    .menu-list > dt{
        font-size: 15px;
        margin-bottom: 6px;
    }
    .menu-list > dt > i{
        margin-right: 5px;
    }
    .menu-list > dd{
        padding: 7px 0 7px 22px;
    }
    .menu-list > dd:hover{
        background-color: #2baee9;
        color: #ffffff;
        cursor: pointer;
    }
    .content-detail .menu-list > dd{
        padding: 3px 0 3px 22px;
    }
    .extend-box{
        width: 94%;
        position: absolute;
        left: 3%;
        margin-top: 16px;
        background-color: #fff;
        text-align: left;
        border-radius: 5px;
        padding: 7px 20px;
        border: 1px solid #efefef;
    }
    .extend-box > .nav-ico{
        border: 8px solid transparent;
        border-top: 0;
        border-bottom-color: #ffffff;
        position: absolute;
        top: -8px;
    }
    .filter-box > .ivu-checkbox-group{
        margin-top: 10px;
    }
    .displayType-box > .nav-ico{
        right: 17px;
    }
    .filter-box > .nav-ico{
        left: 70px;
    }
</style>
