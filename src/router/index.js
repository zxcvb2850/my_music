import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const SongSheet = (resolve) => {
  import('components/songSheet/songSheet').then((module) => {
    resolve(module)
  })
}

const AnchorStation = (resolve) => {
  import('components/anchorStation/anchorStation').then((module) => {
    resolve(module)
  })
}

const RankingList = (resolve) => {
  import('components/rankingList/rankingList').then((module) => {
    resolve(module)
  })
}

const SongDetail = (resolve) => {
  import('components/song-detail/song-detail').then((module) => {
    resolve(module)
  })
}

const routers = new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: '个性推荐',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: SongDetail
        }
      ]
    },
    {
      path: '/songSheet',
      name: '歌单',
      component: SongSheet
    },
    {
      path: '/anchorStation',
      name: '主播电台',
      component: AnchorStation
    },
    {
      path: '/rankingList',
      name: '排行榜',
      component: RankingList
    }
  ],
  linkActiveClass: "active"
})

export default routers;
