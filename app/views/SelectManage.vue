<template>
    <div class="cleanfix root-node">
        <ul class="manege-list">
            <li v-for="(item,index) of manageArr"
                :class="{'active': item.manageId == focusManageDetail.manageId}"
                @click="focusManage(index)">
                <a v-text="item.manageName"></a>
                <div class="cleanfix">
                    <span class="remark-box" v-text="item.remark" :title="item.remark"></span>
                    <span class="target-box" v-text="item.targetFolder" :title="item.targetFolder"></span>
                </div>
            </li>
        </ul>
        <div class="manage-detail">
            <div class="cleanfix">
                <div class="float-right">
                    <Button type="primary" icon="home" @click="openManage" v-show="manageArr.length">打开</Button>
                    <Button icon="plus" @click="openAddModal">新增</Button>
                    <Button icon="trash-b" @click="deleteManage" v-show="manageArr.length">删除</Button>
                </div>
            </div>
            <ul class="detail-list" v-show="focusManageDetail.manageId">
                <li>
                    <span class="title-text">管理层名：</span>
                    <span class="content-text" v-text="focusManageDetail.manageName"></span>
                </li>
                <li>
                    <span class="title-text">源文件夹：</span>
                    <span class="content-text" :title="focusManageDetail.sortFolder">{{ focusManageDetail.sortFolder | toString }}</span>
                </li>
                <li>
                    <span class="title-text">目标文件夹：</span>
                    <span class="content-text" v-text="focusManageDetail.targetFolder" :title="focusManageDetail.targetFolder"></span>
                </li>
                <li>
                    <span class="title-text">上次使用：</span>
                    <span class="content-text">{{ focusManageDetail.lastOpenTime | formatDate(true,"/") }}</span>
                </li>
                <li>
                    <span class="title-text">备注：</span>
                    <span class="content-text" v-text="focusManageDetail.remark"></span>
                </li>
                <li>
                    <span class="title-text">主要标签：</span>
                    <tag v-for="item in focusManageDetail.mainTag"></tag>
                    <span class="content-text" v-if="!(focusManageDetail.mainTag && focusManageDetail.mainTag.length)">尚未开始整理，无法统计</span>
                </li>
            </ul>
        </div>
        <Modal
            v-model="showAdd"
            title="新增管理层"
            @on-ok="confirmAdd">
            <div class="form-group">
                <span>管理层名</span>
                <Input v-model="manageName"></Input>
            </div>
            <div class="form-group">
                <span>源文件夹</span>
                <div>
                    <div>
                        <Input
                            readonly
                            v-model="sourceTips"
                            placeholder="请选择一个或多个源文件夹">
                            <Button slot="append" icon="ios-search" @click="choseSource"></Button>
                        </Input>
                    </div>
                    <div class="source-list">
                        <Tag
                            v-for="(item, index) in sourceFolder"
                            @on-close="deleteSourceFolder(index)"
                            color="blue"
                            closable>{{item}}</Tag>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <span>目标文件夹</span>
                <Input readonly v-model="targetFolder">
                    <Button slot="append" icon="ios-search" @click="choseTarget"></Button>
                </Input>
              </div>
            <div class="form-group">
                <span>备注</span>
                <Input v-model="manageRemark"></Input>
            </div>
        </Modal>
    </div>

</template>
<script>

    import store from 'vuex'
    import { ipcRenderer as ipc } from 'electron'

    export default{
        data () {
            return {
                manageArr: [],
                focusManageDetail: {},
                showAdd: false,
                manageName: "",
                sourceFolder: [],
                targetFolder: "",
                manageRemark: "",
                sourceTemp: ""
            }
        },
        methods: {
            openAddModal() {
                this.manageName = "";
                this.sourceFolder = [];
                this.targetFolder = "";
                this.manageRemark = "";
                this.showAdd = true;
            },
            confirmAdd() {
                let name = this.manageName,
                    source = this.sourceFolder,
                    that = this;
                if(name == ""){
                    this.$Message.error("请输入管理层名");
                    return;
                }
                if(!source.length){
                    this.$Message.error("请选择一个或多个源文件夹");
                    return;
                }
                this.$store.dispatch("addManage",{
                    name: name,
                    source: source,
                    target: this.targetFolder,
                    remark: this.manageRemark
                }).then(function () {
                    that.manageArr = that.$store.getters.getManageList;
                    ipc.send("saveConfigFile","softConfig.config",that.$store.getters.getSoftConfig);
                });
            },
            choseTarget() {
                let that = this;
                ipc.once("selectResult", function (e,result) {
                    if(result == null){
                        that.targetFolder = "";
                    }else {
                        that.targetFolder = result[0];
                    }
                });
                ipc.send("selectFolder");
            },
            choseSource() {
                let that = this;
                ipc.once("selectResult", function (e,result) {
                    if(result != null){
                        that.sourceFolder.push(result[0]);
                    }
                });
                ipc.send("selectFolder");
            },
            deleteSourceFolder(index) {
                this.sourceFolder.splice(index,1);
            },
            focusManage(index) {
                this.focusManageDetail = this.manageArr[index];
            },
            deleteManage() {
                let manageId = this.focusManageDetail.manageId;
                let manageIndex = -1;
                let that = this;
                this.manageArr.some(function(v,i){
                    if(v.manageId == manageId){
                        manageIndex = i;
                        return true;
                    }
                });
                this.manageArr.splice(manageIndex,1);
                this.$store.dispatch("delManage",manageIndex).then(function(){
                    ipc.send("saveConfigFile","softConfig.config",that.$store.getters.getSoftConfig);
                });
            },
            openManage() {
                this.$router.push({
                    path: "main",
                    query: {
                        manageId: this.focusManageDetail.manageId
                    }
                });
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
        computed: {
            sourceTips() {
                return this.sourceFolder.length ? '已选' + this.sourceFolder.length + '项' : ''
            }
        },
        watch: {
            manageArr(newArr) {
                if(newArr.length){
                    this.focusManage(0);
                }else {
                    this.focusManageDetail = {};
                }
            }
        },
        mounted: function () {
            this.softConfig();
        }

    }
</script>
<style>

    .cleanfix:after{
        content: "";
        display: block;
        clear: both;

    }
    .float-right{
        float: right;
    }
    .form-group{
        margin-bottom: 20px;
    }
    .manege-list{
        width: 270px;
        height: 100%;
        float: left;
    }
    .manege-list > li{
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        border-left: 3px solid transparent;
    }
    .manege-list > li.active{
        border-left-color: #3091f2;
    }
    .manege-list > li > a{
        padding-bottom: 7px;
        display: block;
        font-size: 16px;
    }
    .manage-detail{
        width: calc(100% - 270px);
        height: 100%;
        border-left: 1px solid #cccccc;
        float: left;
        padding: 15px;
    }
    .source-list{
        margin-top: 10px;
    }
    .remark-box{
        float: left;
        width: 65%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaaaaa;
    }
    .target-box{
        float: right;
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaaaaa;
    }
    .detail-list{
        margin-top: 100px;
        margin-left: 25px;
    }
    .detail-list > li{
        margin-bottom: 25px;
        white-space: nowrap;
    }
    .title-text{
        display: inline-block;
        width: 100px;
        text-align: right;
        vertical-align: middle;
        font-size: 15px;
    }
    .content-text{
        width: calc(100% - 120px);
        padding: 3px 10px;
        font-size: 14px;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        text-overflow: ellipsis;
        border-bottom: 1px solid #cccccc;
    }
</style>
