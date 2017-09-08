<template>
    <div class="header">
        <h2 class="header-title">网易云音乐</h2>
        <div class="line-wrapper">
            <span class="icon icon-menu line" @click="showMenu"></span>
        </div>
        <div class="search">
            <span class="icon icon-search" @click="searchShow"></span>
        </div>
        <!--这个是菜单出来后的遮罩层-->
        <div class="menu-mask" @click="hideMenu" v-show="isNavMenu"></div>
        <transition name="slow">
            <div class="nav-menu" v-show="isNavMenu">
                <div class="user-info">
                    <div class="user-img"><img class="avatar" v-lazy="avatar" alt=""></div>
                    <div class="info">
                        <span class="username">大白胡子</span>
                        <span class="grade">7级</span>
                        <a href="javascript:;"><span class="sign">签到</span></a>
                    </div>
                </div>
                <div class="nav-list">
                    <ul class="list-wrapper">
                        <li class="list" @click="showHistory">最近播放</li>
                    </ul>
                </div>
            </div>
        </transition>
        <search-page ref="searchPage"></search-page>
        <play-history ref="playHistory"></play-history>
    </div>
</template>

<script>
    import SearchPage from "components/header/searchPage"
    import PlayHistory from "components/play-history/play-history"

    export default {
        data(){
            return {
                avatar: "http://scimg.jb51.net/touxiang/201704/2017041921224424.jpg",
                isNavMenu: false
            }
        },
        methods: {
            searchShow(){
                this.$refs.searchPage.searchShow();
            },
            showMenu(){
                this.isNavMenu = !this.isNavMenu
            },
            hideMenu(){
                this.isNavMenu = !this.isNavMenu;
            },
            showHistory(){
                this.$refs.playHistory.show()
            }
        },
        components: {
            SearchPage,
            PlayHistory
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    .header {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: @headerHeight;
        background-color: @mainBg;
        .header-title {
            font: 16px/@headerHeight none;
            text-align: center;
            color: @bgcolor;
        }
        .line-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: @lineWidth;
            margin: 12px 16px;
            .line {
                font-size: 20px;
                color: @bgcolor;
            }
            .line:nth-child(2) {
                margin: 6px 0;
            }
        }
        .search {
            position: absolute;
            right: 20px;
            top: 0;
            width: 20px;
            height: 20px;
            .icon {
                padding: 4px;
                height: @headerHeight;
                line-height: @headerHeight;
                color: @bgcolor;
                font-size: @fontSizeIcon;
            }
        }
        .nav-menu {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 70%;
            z-index: 10;
            background-color: @bgcolor;
            transition: all .25s;
            &.slow-enter {
                transform: translate3d(-100%, 0, 0)
            }
            &.slow-leave-active {
                transform: translate3d(-100%, 0, 0)
            }
            .user-info {
                padding: 50px 0 10px;
                background-image: url(./img/username-bg.jpg);
                -webkit-background-size: cover;
                background-size: cover;
            }
            .user-img {
                margin: 0 0 0 20px;
                width: 60px;
                height: 60px;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                overflow: hidden;
            }
            .avatar {
                width: 100%;
            }
            .info {
                margin: 8px 0px;
                width: 100%;
                font-size: 14px;
                color: @bgcolor;
                .username {
                    margin: 0 8px;
                }
                .grade, .sign {
                    display: inline-block;
                    padding: 2px 8px;
                    border: 1px solid @bgcolor;
                    -webkit-border-radius: 10px;
                    -moz-border-radius: 10px;
                    border-radius: 10px;
                    font-size: 12px;
                    color: @bgcolor;
                }
                .sign {
                    margin-right: 10px;
                    float: right;
                }
            }
            .nav-list {
                width: 100%;
                text-align: left;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                .list {
                    padding: 0 20px;
                    height: 30px;
                    line-height: 30px;
                    font-size: @fontSizeMin;
                    color: @blackColor;
                    .border-1px(@divisionLine);
                }
            }
        }
        .menu-mask {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
            background-color: @maskBgColor;
        }
    }
</style>
