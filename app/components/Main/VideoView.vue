<template>
    <video :src="src" class="video" controls></video>
</template>
<script>

    export default{
        name: "videoView",
        props: {
            src: String
        }
    }
</script>
