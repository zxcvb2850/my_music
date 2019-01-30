<template>
  <div id="app" ref="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import vHeader from 'components/header/header'
  import tab from 'components/tab/tab'
  import player from 'components/player/player'

  export default {
    methods: {},
    components: {
      vHeader,
      tab,
      player
    }
  }
</script>

<style lang="less">

</style>
