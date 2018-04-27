/**
 * Created by lenovo on 2018/3/19.
 */

import * as types from './mutation-types'
// 点击歌曲播放
export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_PLAYING_STATE, true);
}

