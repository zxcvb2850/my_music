<template>
  <div id="app" ref="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import vHeader from 'components/header/header'
  import tab from 'components/tab/tab'

  export default {
    methods: {},
    components: {
      vHeader,
      tab
    }
  }
</script>

<style lang="less">

</style>
