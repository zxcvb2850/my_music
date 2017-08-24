<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="iconfont icon-jiantouicon"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" ref="bgImage" :style="bgStyle">
            <div class="background" :style="bgStyle"></div>
            <div class="filter" ref="filter"></div>
            <div class="music-describe">
                <div class="music-img">
                    <img :src="bgImage" alt="">
                </div>
                <div class="introduce">
                    <h3>{{title}}</h3>
                    <p>{{describe}}</p>
                </div>
            </div>
            <div class="play-wrapper">
                <div ref="playBtn" class="play" v-show="songs.length > 0">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll
                :data="songs"
                class="list"
                :probeType="probeType"
                :listenScroll="listenScroll"
                @scroll="scroll"
                ref="list">
            <div class="songs-list-wrapper">
                <songs-list :songs="songs" @select="selectItem"></songs-list>
            </div>
            <div v-show="!songs.length" class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
    import Scroll from "base/scroll/scroll"
    import SongsList from "base/songs-list/songs-list"
    import Loading from "base/loading/loading"
    import {prefixStyle} from "common/js/dom"
    import {mapActions} from 'vuex'

    const RESERVED_HEIGHT = 40;
    const transform = prefixStyle('transform')
    const backdrop = prefixStyle('backdrop-filter')

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            bgImage: {
                type: String,
                default: ''
            },
            describe: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                scrollY: 0
            }
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods: {
            back(){
                this.$router.back();
            },
            scroll(pos){
                this.scrollY = pos.y
            },
            selectItem(item, index){
                this.selectPlay({
                    list: this.songs,
                    index: index
                })
                console.log(item)
            },
            ...mapActions([
                'selectPlay'
            ])
        },
        watch: {
            scrollY(newY){
                let zIndex = 0
                let scale = 1
                let blur = 0
                let translateY = Math.max(this.minTranslateY, newY)
                this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;

                /*向下滚动时*/
                const percent = Math.abs(newY / this.imageHeight)
                if (newY > 0) {
                    scale = 1 + percent
                    zIndex = 10
                } else {
                    blur = Math.min(20 * percent, 20)
                }
                this.$refs.filter.style[backdrop] = `blur${blur}px`

                /*向上滚动时*/
                if (newY < this.minTranslateY) {
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                    this.$refs.playBtn.style.display = 'none'
                } else {
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = ''
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style[transform] = `scale(${scale})`
            }
        },
        computed: {
            bgStyle(){
                return `background:url(${this.bgImage})`;
            }
        },
        components: {
            Scroll,
            SongsList,
            Loading
        }
    }
</script>

<style lang="less" scoped>
    @import '~common/style/index';

    @BackWidth: 30px;
    @BackHeight: 40px;

    .music-list {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 20;
        background-color: @songListBg;
        .back {
            position: absolute;
            top: 0;
            left: 6px;
            width: @BackWidth;
            height: @BackHeight;
            line-height: @BackHeight - 5;
            text-align: center;
            z-index: 12;
            .icon-jiantouicon {
                display: inline-block;
                font-size: 14px;
                color: @bgcolor;
            }
        }
        .title {
            position: absolute;
            top: 0;
            left: @BackWidth;
            width: 90%;
            z-index: 12;
            line-height: 40px;
            text-align: left;
            color: @bgcolor;
            font-weight: 400;
            .no-wrap();
        }
        .bg-image {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 70%;
            overflow: hidden;
            .background {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-size: cover;
            }
            .music-describe {
                position: absolute;
                top: @headerHeight + 10px;
                left: 0;
                display: flex;
                .music-img {
                    flex: 120px 0 0;
                    padding: 0 20px;
                    margin: 0 auto;
                    img {
                        width: 100%;
                    }
                }
                .introduce {
                    flex: 1;
                    padding-right: 30px;
                    line-height: 18px;
                    color: @bgcolor;
                    h3 {
                        font-weight: normal;
                        font-size: 14px;
                    }
                    p {
                        font-size: 10px;
                    }
                }
            }
            .play-wrapper {
                position: absolute;
                bottom: 20px;
                width: 100%;
                z-index: 50;
                .play {
                    box-sizing: border-box;
                    width: 120px;
                    padding: 7px 0;
                    margin: 0 auto;
                    text-align: center;
                    border: 1px solid @bgcolor;
                    color: @bgcolor;
                    border-radius: 100px;
                    font-size: 0;
                }
                .icon-play {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: 14px;
                }
                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 12px;
                }
            }
            .filter {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 17, 27, 0.4);
            }
        }
        .bg-layer {
            position: relative;
            height: 100%;
            background-color: @bgcolor;
        }
        .list {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background-color: @bgcolor;
            .song-list-wrapper {
                padding: 20px 30px;
            }
        }
    }
</style>
