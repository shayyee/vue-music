/**
 * Created by lenovo on 2018/3/19.
 */
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  }
}

export default mutations