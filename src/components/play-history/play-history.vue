<template>
    <div class="play-history" v-show="historyFlag">
        <div class="header">
            <span class="icon icon-back" @click="back"></span>
            <h2 class="title">最近播放</h2>
        </div>
        <!--<div class="history-play" @click="selectPlay">播放全部</div>-->
        <scroll
                :data="playHistory"
                class="list"
                ref="list">
            <div class="songs-list-wrapper">
                <songs-list :songs="playHistory" @select="selectItem"></songs-list>
            </div>
            <div v-show="!playHistory.length" class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from "vuex"
    import Scroll from "base/scroll/scroll"
    import SongsList from "base/songs-list/songs-list"
    import Loading from "base/loading/loading"

    export default {
        data(){
            return {
                historyFlag: false
            }
        },
        created(){
            setTimeout(() => {
                this.$refs.list.refresh()
            }, 20)
        },
        methods: {
            show(){
                this.historyFlag = true
            },
            hide(){
                this.historyFlag = false
            },
            back(){
                this.hide()
            },
            selectItem(item, index){
                console.log(item)
                this.insertSong(item)
            },
            selectPlay(){
                this.setSequenceList(this.playHistory)
            },
            ...mapMutations({
                'setSequenceList': 'SET_SEQUENCE_LIST'
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        computed: {
            ...mapGetters([
                'playHistory'
            ])
        },
        components: {
            Scroll,
            SongsList,
            Loading
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    .play-history {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: @bgcolor;
        z-index: 10;
        .header {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: @tabHeight;
            line-height: @tabHeight;

            font-size: @fontSizeTile;
            font-weight: 500;
            background-color: @mainBg;
            color: @bgcolor;
            .icon {
                float: left;
                margin-left: 10px;
                width: @tabHeight;
                text-align: center;
                height: @tabHeight;
                line-height: @tabHeight;
            }
            .title {
                float: left;
                width: 80%;
                text-align: center;
            }
        }
        .history-play{
            position: absolute;
            top: @tabHeight;
            left:0;
            right:0;
            height: 30px;
        }
        .list {
            position: absolute;
            top: @tabHeight;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
</style>