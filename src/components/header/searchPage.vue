<template>
    <transition name="slow">
        <div class="search-page" v-if="isSearchPage">
            <div class="head-wrapper">
                <div class="back-wrapper">
                    <span class="icon icon-back search-back" @click="backIndex"></span>
                </div>
                <div class="search-wrapper">
                    <input type="text" class="search-text"
                           v-model="searchText" throttle
                           @blur="showBorder = !showBorder"
                           @focus="showBorder=false"
                           placeholder="请输入歌名，歌手">
                    <!--search的渐变下边框-->
                    <span class="search-border" :class="showBorder?'search-border-blur':'search-border-focus'"></span>
                    <span class="icon icon-close" v-if="searchText" @click="clearSearchText"></span>
                </div>
            </div>
            <scroll
                    :data="searchList"
                    :pullUp="pullUp"
                    @pullUp="loopRefresh"
                    class="search-list"
            >
                <ul>
                    <li class="list" v-for="song in searchList">
                        <h3 class="name">{{song.name}}</h3>
                        <p class="singer">{{filterSinger(song.artists)}}-{{song.album.name}}</p>
                    </li>
                </ul>
            </scroll>
        </div>
    </transition>
</template>

<script>
    import api from "api"
    import {ERR_OK} from "api/config"
    import Scroll from "base/scroll/scroll"
    import Loading from "base/loading/loading"

    export default {
        data(){
            return {
                isSearchPage: false,
                showBorder: true,
                searchText: '',
                searchList: [],
                limit: 20,
                pullUp: true                 //上拉刷新
            }
        },
        methods: {
            searchShow(){
                this.isSearchPage = true;
            },
            backIndex(){
                this.isSearchPage = !this.isSearchPage;
                this.searchText = '';
            },
            clearSearchText(){
                this.searchText = '';
            },
            filterSinger(singer) {
                let ret = []
                if (!singer) {
                    return ''
                }
                singer.forEach((s) => {
                    ret.push(s.name)
                })
                return ret.join('/')
            },
            loopRefresh(){
                this.limit += 5;
                console.log(this.limit)
                let nowLimit = this.limit;
                setTimeout(() => {
                    api.getSearchMusic(this.searchText, this.limit).then((res) => {
                        res = res.data
                        if (res.code === ERR_OK) {
                            this.searchList = res.result.songs
                            if (nowLimit > res.result.songs.length) {
                                console.log("就这么多了")
                            }
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }, 1000)
            }
        },
        watch: {
            searchText(){
                this.limit = 20         //归位
                if (this.searchText == '') {
                } else {
                    api.getSearchMusic(this.searchText, this.limit).then((res) => {
                        res = res.data
                        if (res.code === ERR_OK) {
                            this.searchList = res.result.songs
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style lang="less" scoped>
    @import "../../common/style/index";

    .search-page {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: @bgcolor;
        transition: all .25s;
        z-index: 100;
        &.slow-enter {
            transform: translate3d(0, 100%, 0)
        }
        &.slow-leave-active {
            transform: translate3d(0, 100%, 0)
        }
        .head-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            display: flex;
            height: @headerHeight;
            line-height: @headerHeight;
            background-color: @mainBg;
            .back-wrapper {
                flex: 0 0 40px;
                .search-back {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                    color: @bgcolor;
                }
            }
            .search-wrapper {
                position: relative;
                flex: 1;
                .search-text {
                    padding: 6px 0;
                    width: 90%;
                    border: none;
                    background-color: transparent;
                    color: @bgcolor;
                }
                .search-border {
                    transition: all .35s;
                    &.search-border-blur {
                        display: block;
                        position: absolute;
                        bottom: 8px;
                        left: 0;
                        width: 90%;
                        height: 1px;
                        background-image: radial-gradient(farthest-corner ellipse at 50% 50%, rgba(255, 255, 255, .8), rgba(255, 255, 255, .1));
                    }
                    &.search-border-focus {
                        display: block;
                        position: absolute;
                        bottom: 8px;
                        left: 0;
                        width: 90%;
                        height: 1px;
                        background-color: @bgcolor;
                    }
                }
            }
        }
        .search-list {
            position: absolute;
            top: @headerHeight;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
            .list {
                padding: 6px 10px;
                .border-1px(@divisionLine);
                .name {
                    width: 100%;
                    font-weight: 500;
                    font-size: @fontSizeTile;
                    line-height: @fontSizeIcon;
                    color: @blackColor;
                    .no-wrap();
                }
                .singer {
                    width: 100%;
                    font-size: @fontSizeDesc;
                    color: @iconColor;
                    line-height: 20px;
                    .no-wrap();
                }
            }
        }
    }
</style>
