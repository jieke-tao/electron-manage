<template>
    <div class="fileView-box">
        <video-view :src="url" v-if="fileDetail.type=='video'"></video-view>
        <audio-view :src="url" v-if="fileDetail.type=='music'"></audio-view>
        <img-view :src="url" v-if="fileDetail.type=='image'"></img-view>
        <other-view :detail="fileDetail" v-if="fileDetail.type=='others' || fileDetail.type=='document' || fileDetail.type=='compress'"></other-view>
    </div>
</template>
<script>


    import uri from '../../connect/readLocalFile/index';
    import videoView from './VideoView.vue';
    import audioView from './AudioView.vue';
    import imgView from './ImageView.vue';
    import otherView from './otherView.vue';


    export default{
        name: "fileView",
        props: {
            fileDetail: Object
        },
        components:{
            videoView,
            imgView,
            audioView,
            otherView
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
    .fileView-box video,
    .fileView-box audio{
        width: 100%;
        max-height: 100%;
    }
    .fileView-box img{
        max-width: 100%;
        max-height: 100%;
    }
</style>
