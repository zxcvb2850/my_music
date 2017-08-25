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
                    <span>暂无消息</span>
                </div>
            </div>
        </transition>
        <!--<search-page ref="searchPage"></search-page>-->
    </div>
</template>

<script>

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
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../common/style/index";

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
            background-color: @iconColor;
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
                margin-top: 50%;
                width: 100%;
                text-align: center;
                background-color: @iconColor;
            }
        }
        .menu-mask {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
            background-color: rgba(100, 100, 100, .5);
        }
    }
</style>
