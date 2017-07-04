/**
 * Created by 大白胡子 on 2017/6/27.
 */
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer){
    state.singer = singer
  }
}

export default mutations
