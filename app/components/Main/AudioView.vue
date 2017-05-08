<template>
    <audio :src="src" class="audio" controls></audio>
</template>
<script>

    export default{
        name: "audioView",
        props: {
            src: String
        }
    }
</script>
