<template>
    <div class="cleanfix root-node setting-root">
        <div class="setting-area">
            <ul class="menu-left">
                <li :class="settingId == 1 ? 'active' : ''" @click="switchSetting(1)">管理层设置</li>
                <li :class="settingId == 2 ? 'active' : ''" @click="switchSetting(2)">整理设置</li>
                <li :class="settingId == 3 ? 'active' : ''" @click="switchSetting(3)">标签设置</li>
                <li :class="settingId == 4 ? 'active' : ''" @click="switchSetting(4)">软件设置</li>
            </ul>
            <div class="content-right">
                <floor-set v-show="settingId == 1"></floor-set>
                <manage-set v-show="settingId == 2"></manage-set>
                <tag-set v-show="settingId == 3"></tag-set>
                <soft-set v-show="settingId == 4"></soft-set>
            </div>
        </div>
        <div class="button-area">
            <Button type="primary" size="small">确定</Button>
            <Button size="small">取消</Button>
            <Button size="small">应用</Button>
        </div>
    </div>
</template>
<script>

    import manageSet from '../components/Setting/ManageSet.vue';
    import floorSet from '../components/Setting/FloorSet.vue';
    import softSet from '../components/Setting/SoftSet.vue';
    import tagSet from '../components/Setting/TagSet.vue';

    export default{
        components: {
            manageSet,
            floorSet,
            softSet,
            tagSet
        },
        data () {
            return {
                settingId: "1"
            }
        },
        methods: {
            switchSetting(id) {
                this.settingId = id;
            }
        },
        computed: {

        },
        beforeRouteEnter(to, from, next) {
            let id = to.query.id;
            if(id){
                next(function(vm){
                    vm.settingId = id;
                });
            }
        },
        mounted: function () {

        }

    }
</script>
<style>
    .root-node{
        display: flex;
        width: 100%;
    }
    .setting-root{
        flex-direction: column;
    }
    .setting-area{
        display: flex;
        flex: 1;
    }
    .button-area{
        text-align: right;
        padding: 10px;
        border-top: 1px solid #efefef;
    }
    .menu-left{
        width: 150px;
    }
    .content-right{
        flex: 1;
    }
    .menu-left > li{
        padding: 10px 20px;
        cursor: pointer;
    }
    .menu-left > li.active{
        background-color: #2db7f5;
        color: #ffffff;
    }
</style>
