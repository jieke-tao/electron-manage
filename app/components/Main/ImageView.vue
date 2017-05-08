<template>
    <img :src="src" class="img" />
</template>
<script>

    export default{
        name: "imgView",
        props: {
            src: String
        }
    }
</script>
