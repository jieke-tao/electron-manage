<template>
    <div class="other-box">
        <div class="file-ico">
            <span class="file-ext" v-text="detail.ext"></span>
        </div>
        <p>
            <span>文件名称：</span>
            {{detail.name}}
        </p>
        <p>
            <span>文件大小：</span>
            {{detail.size}}
        </p>
        <p>
            <span>创建日期：</span>
            {{detail.createTime}}
        </p>
    </div>
</template>
<script>

    export default{
        name: "otherView",
        props: {
            detail: Object
        }
    }
</script>
<style>
    .other-box{
        width: 200px;
    }
    .other-box > p{
        margin-bottom: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .file-ico{
        width: 100px;
        height: 100px;
        margin: 0 auto 25px;
        position: relative;
        background: url("../../asset/img/others.ico")  center /contain  no-repeat;
    }
    .file-ext{
        font-size: 17px;
        font-weight: bold;
        background-color: #444444;
        color: #ffffff;
        padding: 0 5px;
        position: absolute;
        bottom: 0;
        left: 38px;
    }
</style>