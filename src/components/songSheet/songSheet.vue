<template>
  <div class="song-sheet">
    <div class="sheet-content" ref="sheet">
      <ul class="sheet-wrapper" ref="wrapper">
        <li v-for="item in fineSong" class="sheet-item">
          <div class="item-img">
            <img v-lazy="item.coverImgUrl" alt="">
          </div>
          <div class="item-desc">
            <h3 class="item-title">{{item.name}}</h3>
            <p class="item-author">by {{item.creator.nickname}}</p>
            <p class="item-tag">
              <span class="tag">{{item.tag}}</span>
              <span class="desc">{{item.copywriter}}</span>
            </p>
          </div>
        </li>
        <p class="more">{{more}}</p>
      </ul>
      <div class="loading-content" v-show="!fineSong.length">
        <loading></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import {ERR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading'

  export default {
    data(){
      return {
        fineSong: [],
        limit: 10,
        more: "查看更多"
      }
    },
    created(){
      this._getFineSong();
    },
    methods: {
      _getFineSong(){
        api.getFineSong(this.limit).then((res) => {
          res = res.data;
          if (res.code === ERR_OK) {
            this.fineSong = res.playlists;
            setTimeout(() => {
              this.scroll = new BScroll(this.$refs.sheet, {
                click: true
              })
              this.loopRefresh();
            }, 20)
          }
        })
      },
      loopRefresh(){
        this.scroll.on('touchend', (position) => {
          if (position.y = this.scroll.maxScrollY) {
            this.more = "加载中...";
            this.limit += 5;
            setTimeout(() => {
              api.getFineSong(this.limit).then((res) => {
                res = res.data;
                if (res.code === ERR_OK) {
                  this.fineSong = res.playlists;
                  setTimeout(() => {
                    this.scroll.refresh();
                    this.more = "查看更多";
                  }, 20)
                }
              })
            }, 1000)
          }
        })
      }
    },
    components: {
      Loading
    }
  }
</script>

<style lang="less" scoped>
  @import "~common/style/index";

  .song-sheet {
    position: fixed;
    width: 100%;
    top: @tabHeight + @headerHeight;
    bottom: 0;
    background-color: @divisionLine;
    .sheet-content {
      height: 100%;
      overflow: hidden;
      .sheet-item {
        display: flex;
        margin-top: 4px;
        .border-1px(@divisionLine);
        .item-img {
          flex: 120px 0 0;
          img {
            width: 100%;
          }
        }
        .item-desc {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          padding: 0 20px 0 10px;
          align-items: center;
          .item-title {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            line-height: 16px;
            color: @titleColor;
          }
          .item-author {
            margin-top: 6px;
            width: 100%;
            font-size: 12px;
            color: @textColor;
          }
          .item-tag {
            margin-top: 20px;
            width: 100%;
            font-size: 12px;
            color: @textColor;
            .tag {
              display: inline-block;
              padding: 2px 4px;
              box-sizing: border-box;
              border: 1px solid @mainBg;
              font-size: 10px;
              color: @mainBg;
              transform: scale(0.8);
            }
            .desc {
              display: inline-block;
            }
          }
        }
      }
      .more {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        background-color: @bgcolor;
      }
    }
  }
</style>
