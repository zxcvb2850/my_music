/**
 * Created by 大白胡子 on 2017/6/27.
 */
import * as types from "./mutation-types"
import {playMode} from "common/js/config"
import {RandomArr, FindIndex} from "common/js/common"
import {saveSearch, deleteSearch, savePlay} from "common/js/cache"

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
export const randomPlay = ({commit}, {list}) => {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = RandomArr(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

/*在搜索列表中点击歌曲*/
export const insertSong = function ({commit, state}, song) {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = FindIndex(playlist, song)
    // 因为是插入歌曲，所以索引+1
    currentIndex++
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1)
            currentIndex--
        } else {
            playlist.splice(fpIndex + 1, 1)
        }
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
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

/*搜索历史*/
export const saveSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

/*删除历史*/
export const deleteSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

/*删除列表中单个的歌曲*/
export const deleteSong = ({commit, state}, song) => {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = FindIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = FindIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    let playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE, playingState)
}

/*删除列表中所有的歌曲*/
export const deleteSongList = ({commit}) => {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

/*保存播放历史*/
export const savePlayHistory = ({commit}, song) => {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}