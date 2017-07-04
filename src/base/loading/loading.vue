<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: "正在玩命加载..."
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/style/mixin';

  .loading{
    width:100%;
    text-align: center;
    .desc{
      line-height: 20px;
      font-size: 14px;
      color: @titleColor;
    }
  }

</style>
