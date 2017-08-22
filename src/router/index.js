import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import SongSheet from 'components/songSheet/songSheet'
import AnchorStation from 'components/anchorStation/anchorStation'
import RankingList from 'components/rankingList/rankingList'
import SongDetail from 'components/song-detail/song-detail'

Vue.use(Router)

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
