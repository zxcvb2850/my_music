<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.picUrl" alt="" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <p class="subtitle" v-html="currentSong.singer"></p>
                </div>
                <div class="middle">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img class="image" v-lazy="currentSong.picUrl">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <!--<div class="playing-lyric">{{playingLyric}}</div>-->
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <!--<div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>-->
                    <!--<div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>-->
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon icon-loop"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i class="icon icon-suspendedzhuanhuan"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-xinchangtai"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img width="40" height="40" :src="currentSong.picUrl">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <!--<div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>-->
                <div class="control">
                    <i class="icon icon-menu"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url" ref="audio"></audio>
    </div>
</template>

<script>
    import animations from "create-keyframe-animation"
    import api from "api/index"
    import {ERR_OK} from "api/config"
    import {mapGetters, mapMutations} from "vuex"
    import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform')

    export default {
        watch: {
            currentSong() {
                this.$nextTick(() => {
                    this.$refs.audio.play()
                })
                this.getUrl();
            }
        },
        methods: {
            back(){
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            enter(el, done){
                const {x, y, scale} = this._getPosAndScale

                let animation = {
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    }
                }

                animations.registerAnimation({              //JS自定义动画
                    name: 'move',                           //动画名称
                    animation: animation,                    //js名称
                    presets: {
                        duration: 400,                     //缓动速度
                        easing: 'linear'                    //线性缓动
                    }
                })

                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter(){
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = ''
            },
            leave(el, done) {
                this.$refs.cdWrapper.style.transition = 'all .4s'
                const {x, y, scale} = this._getPosAndScale()
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend', done)
            },
            afterLeave() {
                this.$refs.cdWrapper.style.transition = ''
                this.$refs.cdWrapper.style[transform] = ''
            },
            getUrl(){
              this.currentSong.getUrl().then((url)=>{
                  return url
              })
            },
            _getPosAndScale(){
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = window.innerHeight - width / 2 - paddingTop - paddingBottom
                return {x, y, scale}
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN'
            })
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

    @lineHeight: 30px;

    .player {
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background-color: #000;
            &.normal-enter-active, &.normal-leave-active {
                transition: all .4s;
                .top, .bottom {
                    transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
                }
            }
            &.normal-enter, &.normal-leave-active {
                opacity: 0;
                .top {
                    transform: translate3d(0, -100px, 0);
                }
                .bottom {
                    transform: translate3d(0, 100px, 0);
                }
            }
            .background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.6;
                filter: blur(20px);
                transform: scale(1.2);
                z-index: -1;
            }
            .top {
                position: relative;
                margin-bottom: 25px;
                .back {
                    position: absolute;
                    top: 0;
                    left: 6px;
                    z-index: 50;
                }
                .icon-back {
                    display: block;
                    padding: @lineHeight/2 10px;
                    color: @bgcolor;
                    font-size: @fontSizeTile;
                    font-weight: 600;
                }
                .title {
                    margin: 4px auto 0;
                    width: 70%;
                    line-height: @lineHeight;
                    text-align: left;
                    .no-wrap();
                    color: @bgcolor;
                    font-size: @fontSizeTile;
                    font-weight: 400;
                }
                .subtitle {
                    margin: 0 auto;
                    width: 70%;
                    line-height: @lineHeight/2;
                    text-align: left;
                    font-size: @fontSizeDesc;
                    color: @songListBg;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
                white-space: nowrap;
                font-size: 0;
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                }
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        &.play {
                            animation: rotate 20s linear infinite;
                        }
                        &.pause {
                            animation-play-state: paused;
                        }
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: 30px auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: 20px;
                            line-height: 20px;
                            font-size: @fontSizeMin;
                            color: @mainBg;
                        }
                        .middle-r {
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                        .lyric-wrapper {
                            width: 80%;
                            margin: 0 auto;
                            overflow: hidden;
                            text-align: center;
                        }
                        .text {
                            line-height: 32px;
                            color: @songListBg;
                            font-size: @fontSizeMin;
                            &.current {
                                color: @mainBg;
                            }
                        }
                    }
                }
            }
            .bottom {
                position: absolute;
                bottom: 50px;
                width: 100%;
                .dot-wrapper {
                    text-align: center;
                    font-size: 0;
                    .dot {
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 4px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        //background: $color-text-l;
                        .active {
                            width: 20px;
                            border-radius: 5px;
                            //background: $ color-text-ll;
                        }
                    }
                    .progress-wrapper {
                        display: flex;
                        align-items: center;
                        width: 80%;
                        margin: 0 auto;
                        padding: 10px 0;
                    }
                    .time {
                        //color: $color-text;
                        //font-size: $font-size-small;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
                        .time-l {
                            text-align: left;
                        }
                        .time-r {
                            text-align: right;
                            .progress-bar-wrapper {
                                flex: 1;
                            }
                        }
                    }
                }
                .operators {
                    display: flex;
                    text-align: center;
                }
                .icon {
                    flex: 1;
                    color: @bgcolor;
                    .disable {
                        color: @disabledColor;
                    }
                    i {
                        font-size: 28px;
                    }
                    .i-left {
                        text-align: right;
                    }
                    .i-center {
                        padding: 0 20px;
                        text-align: center;
                    }
                    i {
                        font-size: 36px;
                    }
                    .i-right {
                        text-align: left;
                    }
                    .icon-favorite {
                        color: @mainBg;
                        .normal-enter-active, &.normal-leave-active {
                            transition: all 0.4s;
                        }
                    }
                    .top, .bottom {
                        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
                        .normal-enter, &.normal-leave-active {
                            opacity: 0;
                        }
                    }
                    .top {
                        transform: translate3d(0, -100px, 0);
                    }
                    .bottom {
                        transform: translate3d(0, 100px, 0);
                    }
                }
            }
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
            &.mini-enter-active, &.mini-leave-active {
                transition: all .4s;
            }
            &.mini-enter, &.mini-leave-to {
                opacity: 0;
            }
            .icon {
                flex: 0 0 40px;
                width: 40px;
                padding: 0 10px 0 20px;
                img {
                    border-radius: 50%
                }
                .play {
                    animation: rotate 10s linear infinite;
                }
                .pause {
                    animation-play-state: paused;
                }
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                line-height: 20px;
                overflow: hidden;
                .name {
                    margin-bottom: 2px;
                    .no-wrap();
                    color: @titleColor;
                    font-size: @fontSizeMin;
                    font-weight: 500;
                }
                .desc {
                    .no-wrap();
                    color: @iconColor;
                    font-size: @fontSizeDesc;
                }
            }
            .control {
                flex: 0 0 42px;
                width: 30px;
                padding: 0 10px;
            }
            .icon-play-mini, .icon-pause-mini, .icon-menu {
                font-size: 30px;
                color: @mainBg;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
</style>