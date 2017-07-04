<template>
  <transition name="slow">
    <div class="search-page" v-if="isSearchPage">
      <div class="head-wrapper">
        <div class="back-wrapper">
          <span class="iconfont icon-jiantouicon search-back" @click="backIndex"></span>
        </div>
        <div class="search-wrapper">
          <input type="text" class="search-text"
                 v-model="searchText" throttle
                 @blur="showBorder = !showBorder"
                 @focus="showBorder=false"
                 placeholder="请输入歌名，歌手">
          <!--search的渐变下边框-->
          <span class="search-border" :class="showBorder?'search-border-blur':'search-border-focus'"></span>
          <span class="iconfont icon-guanbi" v-if="searchText" @click="clearSearchText"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import api from '../../api'

  export default {
    data(){
      return {
        isSearchPage: false,
        showBorder: true,
        searchText: ''
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
      }
    },
    watch: {
      searchText(){
        if (this.searchText == '') {
          console.log("无数据");
        } else {
          api.getSearchMusic(this.searchText, 10).then((res) => {
            console.log(res)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
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
    &.slow-enter {
      transform: translate3d(0, 100%, 0)
    }
    &.slow-leave-active {
      transform: translate3d(0, 100%, 0)
    }
    .head-wrapper {
      display: flex;
      height: @headerHeight;
      line-height: @headerHeight;
      background-color: @mainBg;
    }
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
</style>
