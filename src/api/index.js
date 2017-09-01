/**
 * vuex
 * Created by 大白胡子 on 2017/6/8.
 */

import axios from 'axios'

import {
    RecommendList,
    RecommendMv,
    RxclusivePush,
    FineSong,
    SongDetails,
    MusicDetails,
    MusicUrl,
    SearchMusic,
    LyricsMusic,
    MusicComment,
    SongComment,
    BannerUrl,
    MusicAlbum,
    ArtistSinger,
    ArtistMv,
    ArtistAlbum,
    MusicMv,
    ArtistDescribe,
    RankingList
} from './dataurl'

export default {
    //推荐的歌单，没有参数
    getRecommendList(){
        return axios.get(RecommendList)
    },

    //推荐的mv,没有参数
    getRecommendMv(){
        return axios.get(RecommendMv)
    },

    //独家推送,没有参数
    getRxclusivePush(){
        return axios.get(RxclusivePush)
    },

    //获取精品歌单，参数?limit=30;
    getFineSong(limit = 20){
        return axios.get(FineSong, {
            params: {
                limit: limit
            }
        })
    },

    //获取歌单详细信息，参数?id=;歌单的id
    getSongDetails(id){
        return axios.get(SongDetails, {
            params: {
                id: id
            }
        })
    },

    //获取音乐的详细信息，参数?ids= , /*多个参数用逗号隔开*/
    getMusicDetails(id){
        return axios.get(MusicDetails, {
            params: {
                ids: id
            }
        })
    },

    //获取音乐的url，参数?id= , /*多个参数用逗号隔开*/
    getMusicUrl(id){
        return axios.get(MusicUrl, {
            params: {
                id: id
            }
        })
    },

    //搜索音乐，参数?keywords=;可以是汉字
    getSearchMusic(keywords, limit = 10){
        return axios.get(SearchMusic, {
            params: {
                keywords: keywords,
                limit: limit
            }
        })
    },

    //获取音乐的歌词，参数?id=;音乐的id
    getLyricsMusic(id){
        return axios.get(LyricsMusic, {
            params: {
                id: id
            }
        })
    },

    //获取音乐的评论，参数?id=;音乐的id
    getMusicComment(id){
        return axios.get(MusicComment, {
            params: {
                id: id
            }
        })
    },

    //获取歌单的评论，参数?id=;音乐的id
    getSongComment(id){
        return axios.get(SongComment, {
            params: {
                id: id
            }
        })
    },

    //获取banner图片及地址
    getBannerUrl(){
        return axios.get(BannerUrl)
    },

    //获取专辑信息,参数?id=;专辑的id
    getMusicAlbum(id){
        return axios.get(MusicAlbum, {
            params: {
                id: id
            }
        })
    },

    //获取歌手的所有音乐,参数?id=;歌手的id
    getArtistSinger(id){
        return axios.get(ArtistSinger, {
            params: {
                id: id
            }
        })
    },

    //获取歌手的所有mv,参数?id=;歌手的id
    getArtistMv(id){
        return axios.get(ArtistMv, {
            params: {
                id: id
            }
        })
    },

    //获取歌手的所有专辑,参数?id=;歌手的id
    getArtistAlbum(id){
        return axios.get(ArtistAlbum, {
            params: {
                id: id
            }
        })
    },

    //获取MV,参数?mvid=
    getMusicMv(mvid){
        return axios.get(MusicMv, {
            params: {
                mvid: mvid
            }
        })
    },

    //歌手描述，参数?id=;歌手id
    getArtistDescribe(id){
        return axios.get(ArtistDescribe, {
            params: {
                id: id
            }
        })
    },

    //排行榜，参数idx=;排行榜的ID
    getRankingList(id){
        return axios.get(RankingList, {
            params: {
                idx: id
            }
        })
    }
}
