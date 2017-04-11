<template>
    <div class="cleanfix root-node">
        <div class="menu-left">
            <ul class="menu-bar cleanfix">
                <li title="收起侧边栏">
                    <Icon size="20" type="ios-arrow-back"></Icon>
                </li>
                <li title="过滤">
                    <Icon size="20" type="funnel"></Icon>
                </li>
                <li title="切换菜单面板">
                    <Icon size="20" type="arrow-swap"></Icon>
                </li>
                <li title="内容显示">
                    <Icon size="20" type="android-folder-open"></Icon>
                </li>
            </ul>
            <div class="system-menu">
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
                manageId: ""
            }
        },
        methods: {
            addMenuItem() {
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
            this.addMenuItem();
        }

    }
</script>
<style>
    .menu-left{
        width: 30%;
        height: 100%;
        float: left;
        background-color: #f5f5f5;
        border-right: 1px solid #eee;
    }
    .content-right{
        width: 70%;
        height: 100%;
        float: left;
    }
    .menu-bar{
        border-bottom: 1px solid #eee;
    }
    .menu-bar > li{
        width: 25%;
        float: left;
        text-align: center;
        padding: 8px 0 6px;
        cursor: pointer;
        border-left: 1px solid #eee;
    }
    .menu-bar > li:hover{
        color: #2baee9;
    }
    .menu-bar > li:first-child{
        border-left: 0;
    }
    .system-menu{
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
</style>
