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
                    <dd @click="switchManage">切换管理层</dd>
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

                <tree :data="fileListData"></tree>

                <dl class="menu-list" style="display: none">
                    <dt>
                        <Icon size="16" type="folder"></Icon>
                        文件夹名
                    </dt>
                    <dd>文件名1</dd>
                    <dd>
                        <dl></dl>
                    </dd>
                    <dd>文件名3</dd>
                    <dd>文件名4</dd>
                    <dd>文件名5</dd>
                    <dd>文件名6</dd>
                    <dd>文件名7</dd>
                </dl>
            </div>
        </div>
        <div class="content-right">
            <!--<Button @click="scanFile" type="primary">文件扫描测试</Button>-->
            <!--<Button @click="getDBData" type="primary">222</Button>-->
            <!--<Button @click="test22" type="primary">重新注入数据</Button>-->
            <!--<Button @click="test112" type="primary">222</Button>-->
            <!--<Button @click="test11" type="primary">2222</Button>-->

            <div id="a"></div>
        </div>
    </div>

</template>
<script>

    import tree from '../components/main/Tree.vue'
    import store from 'vuex'
    import { ipcRenderer as ipc } from 'electron'
    import b from '../../tests/12';

    export default{
        components: {
            tree
        },
        data () {
            return {
                manageId: "",
                menuBarShow: true,
                menuBarActive: "",
                showSystemSetting: false,
                structureType: 3,
                searchKey: "",
                searchType: ["1","2","3","4","5"],
                dbStore: {
                    instance: {}
                },
                fileListData: []
            }
        },
        methods: {
            rootClick() {
                this.menuBarActive = "";
            },
            menuBarClick(num) {
                if(this.menuBarActive === num){
                    this.menuBarActive = "";
                }else {
                    this.menuBarActive = num;
                }
            },
            switchManage() {
                this.closeDB();
                this.$router.go(-1);
            },
            arrDataToTree(arrData) {
                let result = [];
                arrData.forEach(v => {
                   if(v.parentPath){
                       let index = -1;
                       arrData.some((v1,i1) => {
                           if(v1.sourcePath == v.parentPath){
                               index = i1;
                               return true;
                           }
                       });
                       if(index == -1){
                           result.push(v);
                       }else {
                           if(!arrData[index].children){
                               arrData[index].children = [];
                           }
                           arrData[index].children.push(v);
                       }
                   }else {
                       result.push(v);
                   }
                });
                return result;
            },

            scanFile() {
                let that = this;
                ipc.once("scanFolderResult",function (e,result) {
                    that.updateFileList(result);
                });
                ipc.send("scanFolder",this.manageDetail.sortFolder);
            },
            closeDB(name) {
                this.dbStore.instance.close();
            },
            initDB(name,version = 1) {
                return new Promise(resolve => {
                    let request = window.indexedDB.open(name,version);
                    let that = this;
                    request.onerror=function(e){
                        console.log(e.currentTarget.error.message);
                    };
                    request.onsuccess=function(e){
                        that.dbStore.instance = e.target.result;
                        resolve();
                    };
                    request.onupgradeneeded = function(e){
                        that.dbStore.instance = e.target.result;
                        console.log('DB version changed to ' + version);
                        that.addStore();
                    };
                });

            },
            addStore() {
                if(!this.dbStore.instance.objectStoreNames.contains("fileBase")){
                    let baseInfo = this.dbStore.instance.createObjectStore("fileBase",{ keyPath: 'id', autoIncrement : true });
                    baseInfo.createIndex("typeIndex","type",{ unique: false });
                    baseInfo.createIndex('isDeleteIndex',"isDelete",{ unique: false });
                    baseInfo.createIndex('extIndex',"ext",{ unique: false });
                }
                if(!this.dbStore.instance.objectStoreNames.contains("fileExtend")){
                    let baseInfo = this.dbStore.instance.createObjectStore("fileExtend",{ keyPath: 'id',autoIncrement : true });
                    baseInfo.createIndex("idIndex","id",{ unique: true });
                    baseInfo.createIndex('isDeleteIndex',"isDelete",{ unique: false });
                    baseInfo.createIndex('tagIndex',"tag",{ unique: false });
                    baseInfo.createIndex('pathIndex',"sourcePath",{ unique: false });
                }
            },
            updateFileList(newData) {
                //1,拿到新的文件列表
                //1.5判断是否存在数据库；存在2-3-4-5，不存在新建
                //2,清除两个表中的delete为-1的数据
                //3，将2表中所有文件的delete设为-1
                //4，按路径遍历新的文件列表，存在则delete设为1
                //5，重组新的数据返回渲染
                let that = this;
                let asyncCallback = "";
                if(!this.dbStore.instance.objectStoreNames.contains("fileBase")){
                    asyncCallback = new Promise(resolve => {
                        this.addStore();
                        resolve([]);
                    });
                }else{
                    asyncCallback = new Promise(resolve => {
                        this.delAllInvalid();
                        this.searchValueByKey("fileExtend","isDeleteIndex",0).then(result => {
                            result.forEach(v => {
                                that.updateDataById("fileExtend",v.id,1,"isDelete");
                                that.updateDataById("fileBase",v.id,1,"isDelete");
                            });
                            resolve(result);
                        });
                    })
                }
                asyncCallback.then(hasData => {
                    newData.forEach(v => {
                        let flag = -1;
                        hasData.some((v1,i1) => {
                            if(v1.sourcePath == v.sourcePath){
                                flag = i1;
                                return true;
                            }
                        });
                        if(flag == -1){
                            that.saveDBData("fileBase",v);
                            that.saveDBData("fileExtend",v);
                        }else {
                            that.updateDataById("fileBase",hasData[flag].id,v);
                            that.updateDataById("fileExtend",hasData[flag].id,0,"isDelete");
                        }
                    });
                } );

            },
            saveDBData(storeName,data) {
                if(data){
                    let transaction = this.dbStore.instance.transaction(storeName,"readwrite");
                    let store=transaction.objectStore(storeName);
                    store.add(data);
                }
            },
            //根据键值查询所有的数据（仅限一一对应值）
            searchValueByKey(storeName,searchIndex,value) {
                return new Promise(resolve => {
                    let transaction = this.dbStore.instance.transaction(storeName);
                    let store = transaction.objectStore(storeName);
                    let request = store.index(searchIndex).openCursor(IDBKeyRange.only(value));
                    let result = [];
                    request.onsuccess = function(e){
                        let cursor = e.target.result;
                        if(cursor){
                            result.push(cursor.value);
                            cursor.continue();
                        }else {
                            resolve(result);
                        }
                    };
                });
            },
            //根据键值查询所有的数据（范围查询,含边界值）
            searchValueByArea(storeName,searchIndex,begin = -1,end = -1) {
                let transaction = this.dbStore.instance.transaction(storeName);
                let store = transaction.objectStore(storeName);
                let index = searchIndex ? store.index(searchIndex) : "";
                let request;
                let result = [];

                return new Promise(resolve => {
                    if(begin == -1 && end == -1){
                        request = store.openCursor();
                    }else if(begin == -1){
                        request = index.openCursor(IDBKeyRange.upperBound(end,true));
                    }else if(end == -1){
                        request = index.openCursor(IDBKeyRange.lowerBound(begin,true));
                    }

                    request.onsuccess = function(e){
                        let cursor = e.target.result;
                        if(cursor){
                            console.log(cursor);
                            result.push(cursor.value);
                            cursor.continue();
                        }else {
                            resolve(result);
                        }
                    };
                });
            },
            //删除表中delete为-1的值
            delAllInvalid() {
                let that = this;
                this.searchValueByKey("fileExtend","isDeleteIndex",1).then((collectResult) => {
                    collectResult.forEach(v => {
                        that.delDataById("fileBase",v.id);
                        that.delDataById("fileExtend",v.id);
                    })
                });
            },
            //根据id删除表中的数据
            delDataById(storeName,id) {
                let transaction = this.dbStore.instance.transaction(storeName,'readwrite');
                let store = transaction.objectStore(storeName);
                store.delete(id);
            },
            //根据id更新数据
            updateDataById(storeName,id,value,key) {
                let transaction = this.dbStore.instance.transaction(storeName,'readwrite');
                let store = transaction.objectStore(storeName);
                let request = store.get(id);
                request.onsuccess=function(e){
                    let dataDetail = e.target.result;
                    if(key){
                        dataDetail[key] = value;
                    }else {
                        Object.keys(value).forEach(v => {
                            dataDetail[v] = value[v];
                        })
                    }
                    store.put(dataDetail);
                };
            },
            //从数据库提取所有数据
            getDBData() {
                let that = this;
                this.searchValueByArea("fileBase").then(result => {
                    that.fileListData = that.arrDataToTree(result);
//                    console.log(JSON.stringify(that.fileListData));
                });
            },
            test22() {
                this.fileListData = b;
            }
        },
        computed: {
            manageDetail() {
                let result = this.$store.getters.getManageList.filter(v => {
                    return v.manageId === this.manageId;
                });
                return result.length ? result[0] : [];
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
        watch: {
            manageId(newValue) {
                this.initDB("manage" + newValue).then(() => {
                    if(!this.fileListData.length){
//                        this.scanFile();
//                        this.getDBData();
                    }
                });
            }
        },
        mounted: function () {

            this.fileListData = b;
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
        width: 100%;
        padding: 10px;
        overflow: auto;
        position: absolute;
        top: 37px;
        bottom: 0;
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
