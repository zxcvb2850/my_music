<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="iconfont icon-jiantouicon"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="background" :style="bgStyle"></div>
      <div class="filter"></div>
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
        <div ref="playBtn" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <scroll :data="songs" class="list">
      <div class="songs-list-wrapper">
        <songs-list :songs="songs"></songs-list>
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
    methods: {
      back(){
        this.$router.back();
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
      z-index: 12;
      .icon-jiantouicon {
        display: block;
        padding: 10px;
        font-size: 14px;
        color: @bgcolor;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 12;
      line-height: 40px;
      text-align: center;
      color: @bgcolor;
      .no-wrap();
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      overflow: hidden;
      z-index: 10;
      .background {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-size: cover;
        filter: blur(10px);
      }
      .music-describe {
        position: absolute;
        top: @headerHeight + 10px;
        left: 0;
        display: flex;
        .music-img {
          flex: 120px 0 0;
          padding:0 20px;
          margin:0 auto;
          img {
            width: 100%;
          }
        }
        .introduce{
          flex: 1;
          padding-right: 30px;
          line-height: 18px;
          color: @bgcolor;
          h3{
            font-weight:normal;
            font-size: 14px;
          }
          p{
            font-size: 10px;
          }
        }
      }
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          box-sizing: border-box;
          width: 135px;
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
    .list {
      position: fixed;
      top: 262px;
      bottom: 0;
      width: 100%;
      background: @divisionLine;
      .song-list-wrapper {
        padding: 20px 30px;
      }
    }
  }
</style>
