<template>
    <div class="player" v-show="playList.length > 0">
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img :src="currentSong.picUrl" alt="" width="100%" height="100%">
            </div>
            <div class="top">
                <div class="back">
                    <i class="iconfont icon-jiantouicon"></i>
                    <!--<span>{{currentSong.url[0]}}</span>
                    <p>{{currentSong.lyric[0]}}</p>-->
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <p class="subtitle" v-html="currentSong.singer"></p>
            </div>
        </div>
        <div class="mini-player" v-show="!fullScreen"></div>
    </div>
</template>

<script>
    import api from 'api/index'
    import {ERR_OK} from 'api/config'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                url: '',
                lyric: ''
            }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong'
            ])
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    .player {
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background-color: @songListBg;
        }
        .mini-player {
            display: flex;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 180;
            width: 100%;
            height: 60px;
            background-color: @songListBg;
        }
    }
</style>