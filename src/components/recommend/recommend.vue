<template>
    <div class="recommend" ref="recommend">
        <scroll class="recommend-content" :data="recommendMv" ref="scroll">
            <div>
                <div v-if="recommends.length" class="slider-wrapper">
                    <slider>
                        <div v-for="item in recommends">
                            <img class="needsclick" :src="item.pic" @load="loaderImage" alt="">
                        </div>
                    </slider>
                </div>
                <div class="music-rec">
                    <div class="music-list radio">
                        <div class="icon-wrap">
                            <span class="icon icon-501"></span>
                        </div>
                        <h6 class="title">私人FM</h6>
                    </div>
                    <div class="music-list calendar">
                        <div class="icon-wrap icon-data">
                            <span class="icon icon-calendar"></span>
                            <span class="date">{{newDate}}</span>
                        </div>
                        <h6 class="title">每日歌曲推荐</h6>
                    </div>
                    <div class="music-list rank">
                        <div class="icon-wrap">
                            <span class="icon icon-ranking"></span>
                        </div>
                        <h6 class="title">云音乐热歌榜</h6>
                    </div>
                </div>
                <div class="song-list">
                    <h2 class="list-title">推荐歌单<span class="icon icon-right"></span></h2>
                    <ul class="music-list">
                        <li class="music-item" @click="selectItem(musicItem)" v-for="musicItem in recommendList">
                            <div class="img"><img v-lazy="musicItem.picUrl" :alt="musicItem.name"></div>
                            <h3 class="music-title">{{musicItem.name}}</h3>
                        </li>
                    </ul>
                    <div class="loading-content" v-show="!recommendList.length">
                        <loading></loading>
                    </div>
                </div>
                <div class="rxclusive-list">
                    <h2 class="list-title">独家放送<span class="icon icon-right"></span></h2>
                    <ul class="music-list" ref="getLastLi">
                        <li class="rxclusive-item" v-for="pushItem in rxclusivePush">
                            <div class="img"><img :src="pushItem.picUrl" :alt="pushItem.name"></div>
                            <h3 class="music-title">{{pushItem.name}}</h3>
                        </li>
                    </ul>
                    <div class="loading-content" v-show="!rxclusivePush.length">
                        <loading></loading>
                    </div>
                </div>
                <div class="rec-mv-list">
                    <h2 class="list-title">推荐MV<span class="icon icon-right"></span></h2>
                    <ul class="music-list" ref="getLastLi">
                        <li class="rec-mv-item" v-for="item in recommendMv">
                            <div class="img"><img :src="item.picUrl" :alt="item.name"></div>
                            <h3 class="music-title">{{item.name}}</h3>
                        </li>
                    </ul>
                    <div class="loading-content" v-show="!recommendMv.length">
                        <loading></loading>
                    </div>
                </div>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import api from "api";
    import {ERR_OK} from 'api/config'
    import Slider from "base/silder/silder"
    import Scroll from "base/scroll/scroll"
    import Loading from "base/loading/loading"
    import {mapMutations} from "vuex"

    export default {
        data(){
            return {
                recommends: [],
                newDate: '01',
                recommendList: [],
                rxclusivePush: [],
                recommendMv: []
            }
        },
        created(){
            this._getBanner();
            this._getNowDate();
            this._getRxclusivePush();
            this._getRecommendList();
            this._getRecommendMv();
        },
        methods: {
            _getBanner(){
                api.getBannerUrl().then((res) => {
                    res = res.data;
                    if (res.code === ERR_OK) {
                        this.recommends = res.banners;
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            _getRecommendList(){
                api.getRecommendList().then((res) => {
                    res = res.data;
                    if (res.code === ERR_OK) {
                        this.recommendList = res.result;
                        this.$refs.scroll.refresh();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            _getNowDate(){
                let date = new Date();
                this.newDate = date.getDate();
            },
            _getRxclusivePush(){
                api.getRxclusivePush().then((res) => {
                    res = res.data;
                    if (res.code === ERR_OK) {
                        this.rxclusivePush = res.result;
                        this.$refs.scroll.refresh();
                    }
                })
            },
            _getRecommendMv(){
                api.getRecommendMv().then((res) => {
                    res = res.data;
                    if (res.code === ERR_OK) {
                        this.recommendMv = res.result;
                    }
                })
            },
            loaderImage(){
                if (!this.checkLoader) {
                    this.$refs.scroll.refresh();
                    this.checkLoader = true;
                }
            },
            selectItem(item){
                this.$router.push({
                    path: `/recommend/${item.id}`
                })
                this.setSinger(item)
            },
            ...mapMutations({
                setSinger: "SET_SINGER"
            })
        },
        components: {
            Slider,
            Scroll,
            Loading
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    @musicIconRadius: 50px;

    .recommend {
        position: fixed;
        width: 100%;
        top: @tabHeight + @headerHeight;
        bottom: 0;

        .recommend-content {
            height: 100%;
            overflow: hidden;
        }
        .slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        .music-rec {
            display: flex;
            padding: 10px 0 20px;
            .border-1px(@divisionLine);
            .music-list {
                flex: 1;
                text-align: center;
            }
            .icon-wrap {
                margin: 0 auto 10px;
                width: @musicIconRadius;
                height: @musicIconRadius;
                line-height: @musicIconRadius;
                border: 1px solid @mainBg;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                .icon {
                    font-size: 30px;
                    color: @mainBg;
                }
                &.icon-data {
                    position: relative;
                    .date {
                        position: absolute;
                        left: 0;
                        top: 4px;
                        width: 100%;
                        font-size: 10px;
                        color: @mainBg;
                        text-align: center;
                    }
                }
            }
            .title {
                font-weight: normal;
                font-size: 12px;
            }
        }
        .song-list, .rxclusive-list, .rec-mv-list {
            position: relative;
            margin-top: 30px;
            .list-title {
                padding-left: 6px;
                font-weight: normal;
                font-size: 14px;
                border-left: 2px solid @mainBg;
                color: @titleColor;
                span {
                    padding-left: 4px;
                    color: @textColor;
                }
            }
            .music-list {
                width: 100%;
                font-size: 0;
                text-align: center;
                .music-item {
                    margin-top: 10px;
                    display: inline-block;
                    width: 33%;
                    height: 150px;
                    &:nth-child(3n+1) {
                        float: left;
                    }
                    &:nth-child(3n+3) {
                        float: right;
                    }
                }
                .img {
                    width: 100%;
                    overflow: hidden;
                    img {
                        width: 100%;
                    }
                }
                .music-title {
                    padding: 2px;
                    font-weight: normal;
                    font-size: 10px;
                    height: 30px;
                    line-height: 12px;
                    text-align: left;
                    color: #000;
                }
            }
        }
        .rxclusive-list {
            .rxclusive-item {
                display: inline-block;
                margin: 4px 0;
                width: 49%;
                &:first-child {
                    float: left;
                }
                &:nth-child(2) {
                    float: right;
                }
                &:last-child {
                    width: 100%;
                }
            }
        }
        .rec-mv-list {
            margin-top: 0;
            overflow: hidden;
            .music-list {
                padding: 4px 0;
            }
            .rec-mv-item {
                float: left;
                width: 49%;
                &:nth-child(2n+2) {
                    float: right;
                }
            }
        }

        .loading-content {
            position: absolute;
            width: 100%;
            top: 0;
            height: 30px;
            z-index: 1000;
        }
    }
</style>
