<template>
  <div id="app" class="root-node">
    <router-view></router-view>
  </div>
</template>
<script>
    export default{

    }
</script>
<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html,
    body{
        width: 100%;
        height: 100%;
    }
    .root-node{
        display: flex;
        width: 100%;
        height: 100%;
    }
    .cleanfix:after{
        content: "";
        display: block;
        clear: both;

    }
    .float-right{
        float: right;
    }

    .mask{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1000;
    }
    .loader-box{
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 10000;
        transform: translate(-50%,-50%);
        text-align: center;
    }
    .loader{
        display: inline-block;
        width: 2.5em;
        height: 2.5em;
        margin-bottom: 10px;
        transform: rotate(165deg);
    }

    .loader:before,
    .loader:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 0.25em;
        transform: translate(-50%, -50%);
     }

    .loader:before {
       animation: before 2s infinite;
     }

    .loader:after {
       animation: after 2s infinite;
    }

    @keyframes before {
        0% {
            width: 0.5em;
            box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
        }
        35% {
            width: 2.5em;
            box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
        }
        70% {
            width: 0.5em;
            box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
        }
        100% {
            box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
        }
    }

    @keyframes after {
        0% {
            height: 0.5em;
            box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
        }
        35% {
            height: 2.5em;
            box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
        }
        70% {
            height: 0.5em;
            box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
        }
        100% {
            box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
        }
    }
</style>
