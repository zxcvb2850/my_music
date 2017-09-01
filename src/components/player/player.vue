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
                    <h1 class="title">{{currentSong.name}}<span class="alia"
                                                                v-show="currentSong.alia">({{currentSong.alia}})</span>
                    </h1>
                    <p class="subtitle" v-html="currentSong.singer"></p>
                </div>
                <div class="middle">
                    <div class="middle-l" ref="middleL" @click="showBtnLyric">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" v-lazy="currentSong.picUrl">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric" v-show="noLyric">{{playingLyric}}</div>
                            <div class="playing-lyric" v-show="!noLyric">暂无歌词</div>
                        </div>
                    </div>
                    <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines"
                            :class="hideLyric">
                        <div class="lyric-wrapper" @click="hideBtnLyric" ref="lyricWrapper" v-show="noLyric">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current' : currentLineNum === index}"
                                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                        </div>
                        <div class="lyric-wrapper no-lyric" @click="hideBtnLyric" v-show="!noLyric"><p
                                class="text current">暂无歌词</p></div>
                    </Scroll>

                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-ing">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
                        </div>
                        <span class="time time-count">{{format(currentDuration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-peripheral" @click="changMode">
                            <i class="icon" :class="iconMode"></i>
                        </div>
                        <div class="icon i-next" :class="disable">
                            <i class="icon icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="disable">
                            <i class="icon" :class="playIcon" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-prev" :class="disable">
                            <i class="icon icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-peripheral">
                            <i class="icon icon-xinchangtai"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon-wrapper" :class="cdCls">
                    <img width="40" height="40" v-lazy="currentSong.picUrl">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon icon-mini" :class="playMiniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon icon-menu"></i>
                </div>
            </div>
        </transition>
        <audio
                :src="currentSong.url"
                ref="audio"
                @canplay="ready"
                @error="error"
                @timeupdate="updateTime"
                @ended="end"
        ></audio>
    </div>
</template>

<script>
    import animations from "create-keyframe-animation"
    import Lyric from "lyric-parser"
    import ProgressBar from "base/progress-bar/progress-bar"
    import ProgressCircle from "base/progress-circle/progress-circle"
    import Scroll from "base/scroll/scroll"
    import {ERR_OK} from "api/config"
    import {mapGetters, mapMutations} from "vuex"
    import {prefixStyle} from "common/js/dom"
    import {Zerofill, RandomArr, FindIndex} from "common/js/common"
    import {playMode} from "common/js/config"
    const transform = prefixStyle('transform')
    export default {
        data(){
            return {
                songReady: false,
                currentTime: 0,
                currentDuration: 0,
                currentLyric: null,
                currentLineNum: 0,
                radius: 32,
                hideLyric: '',
                noLyric: true,
                playingLyric: ''
            }
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id) {
                    return
                }
                if (newSong.id === oldSong.id) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.stop()
                    this.currentTime = 0
                    this.playingLyric = ''
                    this.currentLineNum = 0
                }
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.$refs.audio.play()
                    this.getLyric()
                }, 1000)
            },
            playing(newPlaying) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause()
                })
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
                const {x, y, scale} = this._getPosAndScale()
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
            togglePlaying(){
                /*当歌曲地址正在获取时，禁止用户快速点击*/
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing)
                /*控制歌词同步暂停*/
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
            },
            end(){
                if (this.mode === playMode.loop) {
                    this.sequence();
                } else {
                    this.next()
                }
            },
            sequence(){
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
                if (this.currentLyric) {
                    this.currentLyric.seek(0)
                }
            },
            prev(){
                /*当歌曲地址正在获取时，禁止用户快速点击*/
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this.sequence()
                } else {
                    let index = this.currentIndex - 1
                    if (index === -1) {
                        index = this.playList.length - 1
                    }
                    this.setCurrentIndex(index)
                }
                /*当处于暂停状态时切换自动播放*/
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.songReady = false              //歌曲获取的时间
                this.hideBtnLyric()                 //切歌时默认显示CD页
                this.playingLyric = ''              //歌词默认显示空
                /*切歌时重置歌词部分*/
                if (this.currentLyric) {
                    this.currentLineNum = 0
                    this.$refs.lyricList.scrollTo(0, 0, 100)
                }
            },
            next(){
                /*当歌曲地址正在获取时，禁止用户快速点击*/
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this.sequence()
                } else {
                    let index = this.currentIndex + 1
                    if (index === this.playList.length) {
                        index = 0
                    }
                    this.setCurrentIndex(index)
                }
                /*当处于暂停状态时切换自动播放*/
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.songReady = false              //歌曲获取的时间
                this.hideBtnLyric()                 //切歌时默认显示CD页
                this.playingLyric = ''              //歌词默认显示空
                /*切歌时重置歌词部分*/
                if (this.currentLyric) {
                    this.currentLineNum = 0
                    this.$refs.lyricList.scrollTo(0, 0, 100)
                }
            },
            ready(){
                this.songReady = true
                this.currentDuration = this.$refs.audio.duration        //获取总时长
            },
            error(){
                this.songReady = true
                //alert('此歌曲解析错误！')
            },
            updateTime(e){
                this.currentTime = e.target.currentTime
            },
            format(interval) {
                interval = interval | 0
                let minter = Zerofill(interval / 60 | 0)
                let second = Zerofill(interval % 60)
                return `${minter}:${second}`
            },
            onPercentChange(percent){
                const currentTime = this.currentDuration * percent
                this.$refs.audio.currentTime = currentTime
                if (!this.playing) {
                    this.togglePlaying();
                }
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000)
                }
            },
            changMode(){
                const mode = (this.mode + 1) % 3;
                this.setPlayMode(mode)
                let list = null
                if (mode === playMode.random) {
                    list = RandomArr(this.sequenceList)
                } else {
                    list = this.sequenceList
                }
                this.resetCurrentIndex(list)
                this.setPlayList(list)
            },
            resetCurrentIndex(list){
                let index = FindIndex(list, this.currentSong);
                this.setCurrentIndex(index)
            },
            getLyric() {
                this.currentSong.getLyric()
                    .then((lyric) => {
                        this.noLyric = true
                        this.currentLyric = new Lyric(lyric, this.handleLyric)
                        if (this.playing) {
                            this.currentLyric.play()
                        }
                    })
                    .catch((err) => {
                        this.currentLyric = null
                        this.playingLyric = ''
                        this.noLyric = false
                    })
            },
            handleLyric({lineNum, txt}){
                this.currentLineNum = lineNum
                if (lineNum > 5) {
                    let lineEl = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(lineEl, 1000)
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 100)
                }
                /*cd页面的歌词*/
                this.playingLyric = txt
            },
            showBtnLyric(){
                this.$refs.middleL.style.opacity = 0
                this.hideLyric = 'show-lyric'
            },
            hideBtnLyric(){
                this.$refs.middleL.style.opacity = 1
                this.hideLyric = ''
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
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_PLAY_MODE',
                setPlayList: 'SET_PLAYLIST'
            })
        },
        computed: {
            playIcon() {
                return this.playing ? 'icon-btn_suspend' : 'icon-suspendedzhuanhuan'
            },
            playMiniIcon(){
                return this.playing ? 'icon-suspend' : 'icon-start1'
            },
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            disable() {
                return this.songReady ? '' : 'disable'
            },
            percent() {
                return this.currentTime / this.currentDuration
            },
            iconMode(){
                return this.mode === playMode.sequence ? 'icon-loop' : this.mode === playMode.loop ? 'icon-loop_single' : 'icon-random'
            },
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ])
        },
        components: {
            ProgressBar,
            ProgressCircle,
            Scroll
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
                .blur(20px);
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
                    .alia {
                        font-size: @fontSizeDesc;
                    }
                }
                .subtitle {
                    margin: 0 auto;
                    width: 70%;
                    height: 30px;
                    line-height: @lineHeight/2;
                    text-align: left;
                    font-size: @fontSizeDesc;
                    color: @songListBg;
                    overflow: hidden;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
                white-space: nowrap;
                font-size: 0;
                .fade-enter-active, .fade-leave-active {
                    transition: all .35s;
                    opacity: 1;
                }
                .fade-enter, .fade-leave {
                    opacity: 0;
                }
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                    .cd-wrapper {
                        position: absolute;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        height: 100%;
                        &:before {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            content: '';
                            -webkit-box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            box-sizing: border-box;
                            border-radius: 50%;
                            border: 50px solid rgba(255, 255, 255, .1);
                            transform: scale(1.06);
                        }
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 50px solid rgba(10, 10, 10, .8);
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
                            color: @bgcolor;
                        }
                    }
                }
                .middle-r {
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    &.show-lyric {
                        transform: translateX(-100%);
                    }
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        &.no-lyric {
                            min-height: 500px;
                        }
                    }
                    .text {
                        line-height: 32px;
                        color: @disabledColor;
                        font-size: @fontSizeMin;
                        &.current {
                            color: @bgcolor;
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
                }
                .progress-wrapper {
                    display: flex;
                    align-items: center;
                    width: 90%;
                    margin: 0 auto;
                    padding: 10px 0;
                    .time {
                        color: @songListBg;
                        font-size: @fontSizeDesc;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
                        &.time-ing {
                            padding-right: 10px;
                            text-align: left;
                        }
                        &.time-count {
                            padding-left: 10px;
                            text-align: right;
                        }
                    }
                    .progress-bar-wrapper {
                        flex: 1;
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
                &.disable {
                    i {
                        color: @disabledColor;
                    }
                }
                &.i-peripheral {
                    i {
                        font-size: 30px;
                    }
                }
                &.i-next, &.i-prev {
                    i {
                        font-size: 36px;
                    }
                }
                &.i-center {
                    i {
                        font-size: 40px;
                    }
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
            .icon-wrapper {
                flex: 0 0 40px;
                width: 40px;
                padding: 0 10px 0 20px;
                img {
                    border-radius: 50%
                }
                &.play {
                    animation: rotate 10s linear infinite;
                }
                &.pause {
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
                flex: 0 0 30px;
                width: 30px;
                padding-right: 10px;
                .progress-circle {
                    position: relative;
                }
                .icon-mini {
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: @mainBg;
                    width: 32px;
                    line-height: 32px;
                    text-align: center;
                    font-size: 24px;
                    &.icon-start1 {
                        font-size: 20px;
                        width: 36px;
                        line-height: 34px;
                    }
                }
                .icon-menu {
                    color: @mainBg;
                    text-align: left;
                    font-size: 30px;
                }
            }
        }
    }
    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0);
            -moz-transform: rotate(0);
            -ms-transform: rotate(0);
            -o-transform: rotate(0);
            transform: rotate(0);
        }
        100% {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>