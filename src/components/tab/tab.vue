<template>
  <div class="tab">
    <div class="tab-item">
      <router-link to="/recommend">个性推荐</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/songSheet">歌单</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/anchorStation">主播电台</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/rankingList">排行榜</router-link>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
  @import "~common/style/index";

  .tab {
    display: flex;
    height: @tabHeight;
    line-height: @tabHeight;
    font-size: 12px;
    color: #000;
    background-color: @bgcolor;
    .tab-item {
      flex: 1;
      text-align: center;
    }
    a {
      display: block;
      text-decoration: none;
      color: @textColor;
      &.active {
        .border-1px(@mainBg);
      }
    }
  }
</style>
