/**
 * Created by 大白胡子 on 2017/6/27.
 */
import {playMode} from "common/js/config"
import {localSearch, loadPlay} from "common/js/cache"

const state = {
    singer: {},                     //当前展示的歌曲列表
    playing: false,                 //是否播放
    fullScreen: false,              //播放器之间切换
    playList: [],                   //播放列表
    sequenceList: [],               //顺序列表
    mode: playMode.sequence,        //播放顺序
    currentIndex: -1,               //当前播放的index
    searchHistory: localSearch(),   //搜索历史
    playHistory: loadPlay()         //播放历史
}

export default state
