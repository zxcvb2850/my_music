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
export const randomPlay = ({commit}, {list}) => {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = RandomArr(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}