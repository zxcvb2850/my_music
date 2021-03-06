<template>
    <transition name="slow">
        <div class="search-page" v-show="isSearchPage">
            <div class="head-wrapper">
                <div class="back-wrapper">
                    <span class="icon icon-back search-back" @click="backIndex"></span>
                </div>
                <div class="search-wrapper">
                    <input type="text" class="search-text"
                           v-model="searchText" throttle
                           @blur="showBorder = !showBorder"
                           @focus="showBorder=false"
                           ref="searchText"
                           placeholder="请输入歌名，歌手">
                    <!--search的渐变下边框-->
                    <span class="search-border" :class="showBorder?'search-border-blur':'search-border-focus'"></span>
                    <span class="icon icon-close" v-if="searchText" @click="clearSearchText"></span>
                </div>
            </div>
            <div class="search-history" v-show="!searchText" ref="history">
                <h2 class="title">搜索历史</h2>
                <scroll :data="searchHistory" class="history-wrapper" ref="historyList">
                    <ul>
                        <li v-for="searches in searchHistory" class="history-item">
                            <div class="icon">
                                <span class="icon icon-clock"></span>
                            </div>
                            <div class="content">
                                <p class="name" @click="selectHistory(searches)">{{searches}}</p>
                                <span class="icon icon-close" @click="deleteOne(searches)"></span>
                            </div>
                        </li>
                    </ul>
                </scroll>
            </div>
            <div class="search-list-wrapper" ref="searchWrapper" v-show="searchText">
                <scroll
                        :data="searchList"
                        :pullUp="pullUp"
                        @pullUp="searchMore"
                        :beforeScroll="beforeScroll"
                        @beforeScroll="blurInput"
                        class="search-list"
                        ref="search"
                >
                    <ul>
                        <li class="list" v-for="song in searchList" @click="selectItem(song)">
                            <h3 class="name">{{song.name}}</h3>
                            <p class="singer">{{filterSinger(song.artists)}}-{{song.album.name}}</p>
                        </li>
                        <p class="more" v-html="more"></p>
                    </ul>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script>
    import api from "api"
    import {ERR_OK} from "api/config"
    import Scroll from "base/scroll/scroll"
    import Loading from "base/loading/loading"
    import {playlistMixin} from "common/js/mixin"
    import {createSong} from "common/js/song"
    import {debounce} from "common/js/common"
    import {mapActions, mapGetters} from "vuex"

    export default {
        mixins: [playlistMixin],
        data(){
            return {
                isSearchPage: false,
                showBorder: true,
                searchText: '',
                searchList: [],
                musicDetails: [],
                limit: 20,
                pullUp: true,                 //上拉刷新
                beforeScroll: true,
                more: "",
                imgSrc: require('../../assets/loading.gif'),
                hasMore: true
            }
        },
        watch: {
            isSearchPage() {
                this.$refs.historyList.refresh();
            },
            searchText(newText){
                if (!newText) {
                    setTimeout(() => {
                        this.$refs.historyList.refresh();
                    }, 20)
                }
            }
        },
        created(){
            this.$watch('searchText', debounce((newText) => {
                if (newText === '') {
                    this.limit = 20
                    this.more = ''
                    this.searchList = []
                } else {
                    this.more = '查看更多'
                    this.limit = 20
                    this.$refs.search.scrollTo(0, 0)
                    this.search()
                }
                this.$refs.historyList.refresh();
            }, 500))
        },
        methods: {
            handlePlaylist(playlist){
                const bottom = playlist.length > 0 ? '60px' : '0'
                this.$refs.searchWrapper.style.bottom = bottom
                this.$refs.search.refresh()

                this.$refs.history.style.bottom = bottom
                this.$refs.historyList.refresh();
            },
            searchShow(){
                this.isSearchPage = true;
            },
            backIndex(){
                this.searchList = []
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
            search(){
                this.limit = 20             //归位
                this.hasMore = true
                api.getSearchMusic(this.searchText, this.limit).then((res) => {
                    res = res.data
                    console.log(res)
                    if (res.code === ERR_OK) {
                        if (res.result.songCount !== 0) {
                            this.searchList = res.result.songs
                            if (this.searchList.length > 0) {
                                this._checkMore(res.result)
                            }
                        } else {
                            this.searchList = []
                            this.more = '暂无数据'
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                    this.more = '暂无数据'
                })
            },
            searchMore(){
                if (!this.hasMore) {
                    return
                }
                this.limit += 10;
                this.more = `加载中...<img class="more-loading" width="15" height="15" src='${this.imgSrc}' />`;
                api.getSearchMusic(this.searchText, this.limit).then((res) => {
                    res = res.data
                    if (res.code === ERR_OK) {
                        if (res.result.songCount) {
                            this.searchList = res.result.songs
                            this._checkMore(res.result)
                            if (this.limit > res.result.songCount) {
                                this.more = "客官,小的只能找到这么多了^_^"
                            } else {
                                this.more = "查看更多"
                            }
                        } else {
                            this.searchList = []
                            this.more = '暂无数据'
                        }


                    }
                }).catch((err) => {
                    console.log(err)
                    this.more = '数据获取失败'
                })
            },
            selectItem(song){
                if (song.id) {
                    api.getMusicDetails(song.id).then((res) => {
                        res = res.data
                        if (res.code === ERR_OK) {
                            this.musicDetails = this._normalizeSongs(res.songs)
                        }
                    }).catch((err) => {
                        console.log(err)
                        console.log("数据获取失败")
                    })
                }
                setTimeout(() => {
                    if (this.musicDetails[0].id) {
                        this.insertSong(this.musicDetails[0])
                    } else {
                        console.log("数据出错啦")
                    }
                }, 300)
                this.saveSearchHistory(this.searchText)
            },
            blurInput(){
                this.$refs.searchText.blur()
            },
            selectHistory(item){
                this.searchText = item;
            },
            deleteOne(item){
                this.deleteSearchHistory(item)
            },
            _checkMore(data){
                const song = data.songs
                if (!song.length || song.length > data.songCount) {
                    this.hasMore = false
                }
            },
            _normalizeSongs(list){
                let ret = [];
                list.forEach((musicData) => {
                    if (musicData.id) {
                        ret.push(createSong(musicData));
                    }
                })
                return ret;
            },
            ...mapActions([
                'insertSong',
                'saveSearchHistory',
                'deleteSearchHistory'
            ])
        },
        computed: {
            ...mapGetters([
                'searchHistory'
            ])
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
        .search-history {
            position: absolute;
            top: @headerHeight;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
            .title {
                width: 100%;
                height: 30px;
                background-color: @bgcolor;
                line-height: 30px;
                font-weight: 500;
                text-align: center;
            }
            .history-wrapper {
                position: absolute;
                top: 30px;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
            }
            .history-item {
                display: flex;
                padding: 0 20px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                line-height: 40px;
                width: 100%;
                font-size: @fontSizeMin;
                .icon {
                    flex: 30px 0 0;
                    font-size: 20px;
                }
                .content {
                    flex: 1;
                    display: flex;
                    .border-1px(@divisionLine);
                    .name {
                        flex: 1;
                        width: 100%;
                        .no-wrap();
                    }
                    .icon {
                        flex: 0 0 20px;
                        font-size: @fontSizeIcon;
                    }
                }
            }
        }
        .search-list-wrapper {
            position: absolute;
            top: @headerHeight;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
            .search-list {
                width: 100%;
                height: 100%;
                overflow: hidden;
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
                .more {
                    height: 30px;
                    line-height: 30px;
                    font-size: @fontSizeDesc;
                    text-align: center;
                    background-color: @bgcolor;
                }
                .more-loading {
                    width: 30px;
                    height: 30px;
                }
            }
        }
    }
</style>
