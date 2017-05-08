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
                        <Input v-model="searchKey" icon="ios-search" placeholder="输入关键字进行过滤" onEnter="setFileListData"></Input>
                        <Checkbox-group v-model="searchType" @on-change="setFileListData">
                            <Checkbox label="image">图片</Checkbox>
                            <Checkbox label="music">音频</Checkbox>
                            <Checkbox label="video">视频</Checkbox>
                            <Checkbox label="document">文档</Checkbox>
                            <Checkbox label="compress">压缩文件</Checkbox>
                            <Checkbox label="others">其它</Checkbox>
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
                        <Checkbox-group v-model="structureType" vertical @on-change="setFileListData">
                            <Checkbox label="file">文件</Checkbox>
                            <Checkbox label="dir">文件夹</Checkbox>
                        </Checkbox-group >
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
                <tree v-for="item in fileListData" :key="item.createTime" @on-select="activeItem" :data="item"></tree>
            </div>
        </div>
        <div class="content-right">
            <file-view :file-detail="activeFile" v-if="activeFile.type"></file-view>
        </div>
    </div>
</template>
<script>

    import tree from '../components/main/Tree.vue'
    import fileView from '../components/Main/FileView.vue'
    import store from 'vuex'
    import { ipcRenderer as ipc } from 'electron'
    import { computeFileType } from '../utils'
    export default{
        components: {
            tree,
            fileView
        },
        data () {
            return {
                manageId: "",
                menuBarShow: true,
                menuBarActive: "",
                showSystemSetting: false,
                structureType: ["file","dir"],
                searchKey: "",
                searchType: ["image","music","video","document","compress","others"],
                dbStore: {
                    instance: {}
                },
                fileListDataBak: [],
                fileListData: [],
                activeFile: {}
            }
        },
        methods: {
            rootClick() {
                this.menuBarActive = "";
            },
            activeItem(item) {
                this.activeFile = item;
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
                return new Promise(resolve => {
                    ipc.once("scanFolderResult",function (e,result) {
                        that.updateFileList(result).then(() => {
                            resolve();
                        });
                    });
                    ipc.send("scanFolder",this.manageDetail.sortFolder);
                });
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

                return new Promise(resolve => {
                    asyncCallback.then(hasData => {
                        newData.forEach(v => {
                            let flag = -1;
                            v.type = computeFileType(v.ext);
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

                        resolve();
                    });
                });
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
                this.searchValueByArea("fileBase").then(result => {
                    this.fileListDataBak = JSON.stringify(result);//存储成字符串，避免引址
                    this.setFileListData("",result);
                });
            },
            //按条件过滤
            filterFileList(arrData) {
                let filter1 = this.structureType;
                let filter2 = this.searchType;
                let key = this.searchKey;
                let result;

                result = arrData.filter(v => {
                    let flag1 = filter1.indexOf(v.category) !== -1;
                    let flag2 = filter2.indexOf(v.type) !== -1;
                    let flag3 = v.name.indexOf(key) !== -1;
                    if(flag1 && flag2){
                        if(key && flag3){
                            v.name = v.name.replace(key,"<a>" + key + "</a>");
                        }
                        return true;
                    }
                });

                return this.sortFileList(result);

            },
            sortFileList(arrData) {
                //此处暂且仅做文件夹排序
                if(this.structureType.indexOf("dir") !== -1){
                    arrData.sort((prev,next) => {
                        if(next.category === "file"){
                            return -1;
                        }else {
                            return 1;
                        }
                    });
                }

                return arrData;
            },
            setFileListData(e,arrData) {
                if(!(arrData && arrData.length)){
                    arrData = JSON.parse(this.fileListDataBak);
                }
                arrData = this.filterFileList(arrData);
                if(this.structureType.indexOf("dir") !== -1){
                    arrData = this.arrDataToTree(arrData);
                }
                this.fileListData = arrData;
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
                        this.scanFile().then(() => {
                            this.getDBData();
                        });
                    }
                });
            },
            activeFile(newValue) {
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
        width: 270px;
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
        z-index: 1000;
        cursor: pointer;
    }
    .menu-left .expand-ico:hover{
        background: url("../asset/img/expand-menu-hover.png") center no-repeat;
    }
    .content-right{
        width: calc(100% - 270px);
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
        z-index: 100;
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
