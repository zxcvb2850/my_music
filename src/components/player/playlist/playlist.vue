<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <div class="title">
                        <div class="loop-style">
                            <p class="loop-wrapper" @click="changMode">
                                <i class="icon" :class="iconMode"></i>
                                <span class="text">{{modeText}}</span>
                            </p>
                        </div>
                        <p class="clear" @click="showConfirm"><i class="icon icon-trash"></i>清空</p>
                    </div>
                </div>
                <scroll :data="sequenceList" class="list-content" ref="listContent">
                    <transition-group name="list" tag="ul" ref="list">
                        <li
                                :key="item.id"
                                class="item"
                                v-for="(item,index) in sequenceList"
                                @click="selectItem(item,index)"
                                ref="listItem"
                        >
                            <i class="current icon" :class="getCurrentIcon(item)"></i>
                            <p class="text" :class="{'active':currentSong.id === item.id}">{{item.name}}<span
                                    class="singer">-{{item.singer}}</span></p>
                            <span class="like"><i class="icon icon-xinchangtai"></i></span>
                            <span class="delete" @click.stop="deleteOne(item)"><i class="icon icon-close"></i></span>
                        </li>
                    </transition-group>
                </scroll>
            </div>
            <confirm
                    ref="confirm"
                    text="是否清空播放列表"
                    confirmBtnText="清空"
                    @confirm="confirmClear"></confirm>
        </div>
    </transition>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from "vuex"
    import Scroll from "base/scroll/scroll"
    import Confirm from "base/confirm/confirm"
    import {playMode} from "common/js/config"
    import {playerMixin} from "common/js/mixin"

    export default {
        mixins: [playerMixin],
        data() {
            return {
                showFlag: false
            }
        },
        watch: {
            currentSong(newSong, oldSong){
                if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                }
                setTimeout(() => {
                    this.scrollToCurrent(newSong)
                }, 1000)
            }
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                }, 20)
            },
            hide() {
                this.showFlag = false
            },
            getCurrentIcon(item) {
                if (this.currentSong.id === item.id) {
                    return 'icon-suspendedzhuanhuan'
                }
                return ''
            },
            selectItem(item, index) {
                if (this.mode === playMode.random) {
                    index = this.playList.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(current) {
                const index = this.sequenceList.findIndex((song) => {
                    return current.id === song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
            },
            deleteOne(item) {
                this.deleteSong(item)
                if (!this.playList.length) {
                    this.hide()
                }
            },
            showConfirm(){
                this.$refs.confirm.show()
            },
            confirmClear() {
                this.deleteSongList()
                this.hide()
            },
            ...mapMutations({
                'setCurrentIndex': 'SET_CURRENT_INDEX',
                'setPlayingState': 'SET_PLAYING_STATE'
            }),
            ...mapActions([
                'deleteSong',
                'deleteSongList'
            ])
        },
        computed: {
            modeText() {
                return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
            }
        },
        components: {
            Scroll,
            Confirm
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    @ListHeaderHeight: 40px;

    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background-color: @maskBgColor;
        &.list-fade-enter-active, &.list-fade-leave-active {
            transition: opacity 0.3s;
            .list-wrapper {
                transition: all 0.3s;
            }
        }
        &.list-fade-enter, &.list-fade-leave-to {
            opacity: 0;
            .list-wrapper {
                transform: translate3d(0, 100%, 0);
            }
        }
        .list-wrapper {
            position: absolute;
            left: 0;
            top: 40%;
            bottom: 0;
            width: 100%;
            background-color: @bgcolor;
            .list-header {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: @ListHeaderHeight;
                line-height: @ListHeaderHeight;
                padding: 0 20px;
                .title {
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    .loop-style {
                        flex: 1;
                        .loop-wrapper {
                            width: 100px;
                        }
                        .icon {
                            margin-right: 10px;
                            font-size: 16px;
                            font-weight: 700;
                            color: @iconColor;
                        }
                        .text {
                            flex: 1;
                            font-size: @fontSizeDesc;
                            color: @blackColor;
                        }
                    }
                    .clear {
                        flex: 0 0 60px;
                        text-align: right;
                        font-size: @fontSizeMin;
                        //extend-click();
                        .icon-clear {
                            //font-size: $ font-size-medium;
                            //color: $ color-text-d
                        }
                    }
                }
            }
            .list-content {
                position: absolute;
                left: 0;
                right: 0;
                top: @ListHeaderHeight;
                bottom: @ListHeaderHeight;
                overflow: hidden;
                .item {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    padding: 0 30px 0 10px;
                    overflow: hidden;
                    .border-1px(@divisionLine);
                    &.list-enter-active, &.list-leave-active {
                        transition: all 0.1s;
                    }
                    &.list-enter, &.list-leave-to {
                        height: 0;
                    }
                    .icon {
                        font-size: @fontSizeIcon;
                        color: @textColor;
                    }
                    .current {
                        flex: 0 0 30px;
                        width: 30px;
                        text-align: center;
                        &.icon {
                            font-size: @fontSizeTile;
                            color: @mainBg;
                        }
                    }
                    .text {
                        flex: 1;
                        height: 40px;
                        line-height: 40px;
                        font-size: @fontSizeMin;
                        .no-wrap();
                        &.active {
                            color: @mainBg;
                        }
                        .singer {
                            font-size: @fontSizeDesc;
                        }
                    }
                    .like {
                        .icon {
                            //extend-click();
                            margin-right: 15px;
                            &.icon-favorite {
                                //color: $ color-sub-theme;
                            }
                        }
                    }
                    .delete {
                        //extend-click();
                    }
                }
            }
            .list-close {
                text-align: center;
                line-height: 50px;
                background: #000;
                font-size: @fontSizeMin;
                color: #fff;
            }
        }
    }
</style>