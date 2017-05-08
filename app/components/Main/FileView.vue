<template>
    <div class="fileView-box">
        <video-view :src="url" v-if="fileDetail.type=='video'"></video-view>
        <img-view :src="url" v-if="fileDetail.type=='image'"></img-view>
    </div>
</template>
<script>


    import uri from '../../connect/readLocalFile/index';
    import VideoView from './VideoView.vue';
    import imgView from './ImageView.vue';

    export default{
        name: "fileView",
        props: {
            fileDetail: Object
        },
        components:{
            VideoView,
            imgView
        },
        computed: {
            url(){
                return uri + "?path=" + this.fileDetail.sourcePath + "&ext=" + this.fileDetail.ext + "&type=" + this.fileDetail.type;
            }
        }
    }
</script>
<style>
    .fileView-box{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .fileView-box video{
        width: 100%;
        max-height: 100%;
    }
    .fileView-box img{
        max-width: 100%;
        max-height: 100%;
    }
</style>
