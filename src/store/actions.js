/**
 * Created by 大白胡子 on 2017/6/27.
 */
import * as types from "./mutation-types"
import {playMode} from "common/js/config"
import {RandomArr, FindIndex} from "common/js/common"

/*列表中点击歌曲*/
export const selectPlay = ({commit, state}, {list, index}) => {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = RandomArr(list)
        commit(types.SET_PLAYLIST, randomList)
        index = FindIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


/*点击列表上的随机播放*/
export const randomPlay = ({commit}, list) => {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = RandomArr(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

/*在搜索列表中点击歌曲*/
export const insertSong = ({commit, state}, song) => {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    // 记录当前歌曲的index
    let currentSong = playlist[currentIndex]
    // 查找当前列表是否有待插入的歌曲所返回的索引
    let fpIndex = FindIndex(playlist, song)
    //如果列表中有歌曲，插入当前歌曲的下面
    currentIndex++
    // 插入当前歌曲
    playlist.splice(currentIndex, 0, song)
    //如果列表中有当前歌曲,则删除l
    if (fpIndex > -1) {
        playlist.splice(fpIndex, 1)
        currentIndex--
    } else {
        playlist.splice(fpIndex + 1, 1)
    }

    let currentSIndex = FindIndex(sequenceList, currentSong) + 1
    let fsIndex = FindIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
}