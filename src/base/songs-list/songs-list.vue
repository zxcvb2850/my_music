<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="singer">{{song.singer}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    }
  }
</script>
<style scoped lang="less">
  @import '~common/style/index';

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: 16px;
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          .no-wrap();
          color: @titleColor;
        }
        .singer {
          .no-wrap();
          margin-top: 4px;
          color: @titleColor;
        }
      }
    }
  }
</style>
