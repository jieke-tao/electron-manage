<template>
    <div class="cleanfix root-node">
        <ul class="manege-list">
            <li v-for="item of manageArr">
                <a v-text="item.manageName"></a>
                <div class="cleanfix">
                    <span class="remark-box" v-text="item.remark" :title="item.remark"></span>
                    <span class="target-box" v-text="item.TargetFolder" :title="item.TargetFolder"></span>
                </div>
            </li>
        </ul>
        <div class="manage-detail">
            <div>
                <div class="float-right">
                    <Button type="primary" @click="openManage">打开</Button>
                    <Button type="primary" @click="openAddModal">新增</Button>
                    <Button type="primary" @click="openAddModal">删除</Button>
                </div>
            </div>
            <div>
                <span></span>
                <span></span>
            </div>
        </div>
        <Modal
            v-model="showAdd"
            title="新增管理层"
            @on-ok="confirmAdd"
            @on-cancel="cancel">
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
                            v-for="(item, index) of sourceFolder"
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
            openManage() {
                console.log(this.manageArr);
            },

            softConfig() {
                let that = this;
                ipc.once("readFileResult", function (e,result) {
                    console.log(result);
                });
                ipc.send("readConfigFile","softConfig.config");
            },


            aa () {
                alert("写内容：");
                var fileN = __dirname+'/message.config';
                alert("文件名："+fileN);
                fs.writeFileSync(fileN,"dsad", 'utf8');
                console.log("写完成！");
            },
            bb () {
               configFileOperate.readFromFile('./softConfig.config').then(
                   function (a) {
                       alert(JSON.stringify(a));
                   }
               );

            },
            cc () {
//                const {dialog} = require('electron').remote;
//                var a = dialog.showOpenDialog({
//                    properties: ["openDirectory"]
//                });
//                console.log(a);
            },
            zz () {
                this.$Notice.open({
                    title: "123"
                });
                alert(1);
                this.$Message.error("123");
            }
        },
        computed: {
            sourceTips() {
                return this.sourceFolder.length ? '已选' + this.sourceFolder.length + '项' : ''
            }
        },
        mounted: function () {

//            ipc.send("readConfigFile","softConfig.config").then(function (result) {
//                console.log("av");
//                console.log(result);
//            });
            this.softConfig();
//            this.$store.dispatch("initSoftConfig").then(function () {
//                ipc.send("initConfig",that.$store.getters.getSoftConfig);
//                that.manageArr = that.$store.getters.getManageList;
//            });
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
        width: 35%;
        height: 100%;
        padding: 0 10px;
        float: left;
    }
    .manege-list > li{
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }
    .manege-list > li > a{
        padding-bottom: 7px;
        display: block;
        font-size: 16px;
    }
    .manage-detail{
        width: 65%;
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
</style>
