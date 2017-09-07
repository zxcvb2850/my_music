<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h2 class="title">
                        <i class="icon icon-loop"></i>
                        <span class="text">循环列表</span>
                        <span class="clear"><i class="icon icon-trash"></i>清空</span>
                    </h2>
                </div>
                <scroll :data="sequenceList" class="list-content" ref="listContent">
                    <ul>
                        <li
                                class="item"
                                v-for="(item,index) in sequenceList"
                                @click="selectItem(item,index)"
                                ref="listItem"
                        >
                            <i class="current icon" :class="getCurrentIcon(item)"></i>
                            <p class="text" :class="{'active':currentSong.id === item.id}">{{item.name}}<span
                                    class="singer">-{{item.singer}}</span></p>
                            <span class="like">
                            <i class="icon icon-xinchangtai"></i>
                        </span>
                            <span class="delete">
                            <i class="icon icon-close"></i>
                        </span>
                        </li>
                    </ul>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import Scroll from 'base/scroll/scroll'
    import {playMode} from 'common/js/config'

    export default {
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
                this.scrollToCurrent(newSong)
            }
        },
        methods: {
            show(){
                this.showFlag = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                }, 20)
            },
            hide(){
                this.showFlag = false
            },
            getCurrentIcon(item){
                if (this.currentSong.id === item.id) {
                    return 'icon-suspendedzhuanhuan'
                }
                return ''
            },
            selectItem(item, index){
                if (this.mode === playMode.random) {
                    index = this.playList.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(current){
                const index = this.sequenceList.findIndex((song) => {
                    return current.id === song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
            },
            ...mapMutations({
                'setCurrentIndex': 'SET_CURRENT_INDEX',
                'setPlayingState': 'SET_PLAYING_STATE'
            })
        },
        computed: {
            ...mapGetters([
                'sequenceList',
                'currentSong',
                'playList',
                'mode'
            ])
        },
        components: {
            Scroll
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
                    .icon {
                        margin-right: 10px;
                        font-size: 20px;
                        color: @iconColor;
                    }
                    .text {
                        flex: 1;
                        font-size: @fontSizeTile;
                        color: @blackColor;
                    }
                    .clear {
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
                //height: 300px;
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