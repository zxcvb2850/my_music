<template>
    <div class="rank" ref="rank">
        <scroll :data="topList" class="toplist" ref="toplist">
            <ul>
                <li @click="selectItem(item)" class="item" v-for="item in topList">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapMutations} from "vuex"
    import api from "api"
    import {ERR_OK} from "api/config"
    import {dataArray} from "common/js/util"
    import Scroll from "base/scroll/scroll"
    import Loading from "base/loading/loading"
    import {playlistMixin} from "common/js/mixin"
    import {getRankList} from "common/js/song"

    export default {
        mixins: [playlistMixin],
        data(){
            return {
                topList: []
            }
        },
        created(){
            this._getRankList()
        },
        methods: {
            handlePlaylist(playlist){
                const bottom = playlist.length > 0 ? '60px' : '0'
                this.$refs.rank.style.bottom = bottom
                this.$refs.toplist.refresh()
            },
            selectItem(item){
                console.log(item.id)
                this.$router.push({
                    path: `/rankingList/${item.id}`
                })
                this.setSinger(item)
            },
            ...mapMutations({
                setSinger: "SET_SINGER"
            }),
            _getRankList(){
                getRankList('3').then((res) => {
                    this.topList.push(dataArray(res))
                    getRankList('0').then((res) => {
                        this.topList.push(dataArray(res))
                        getRankList('2').then((res) => {
                            this.topList.push(dataArray(res))
                            getRankList('1').then((res) => {
                                this.topList.push(dataArray(res))
                                getRankList('4').then((res) => {
                                    this.topList.push(dataArray(res))
                                    getRankList('14').then((res) => {
                                        this.topList.push(dataArray(res))
                                        getRankList('15').then((res) => {
                                            this.topList.push(dataArray(res))
                                            getRankList('18').then((res) => {
                                                this.topList.push(dataArray(res))
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    .rank {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        background-color: @bgcolor;
        .toplist {
            height: 100%;
            overflow: hidden;
            .item {
                display: flex;
                margin: 0 10px;
                padding-top: 10px;
                height: 100px;
                &:last-child {
                    padding-bottom: 10px;
                }
            }
            .icon {
                flex: 0 0 100px;
                width: 100px;
                height: 100px;
            }
            .songlist {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin: 0 20px;
                height: 100px;
                overflow: hidden;
                background: @bgcolor;
                color: @iconColor;
                font-size: @fontSizeMin;
                .border-1px(@divisionLine);
                .song {
                    .no-wrap();
                    line-height: 26px;
                    .loading-container {
                        position: absolute;
                        width: 100%;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }
</style>
