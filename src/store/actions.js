/**
 * Created by lenovo on 2018/3/19.
 */

import * as types from './mutation-types'
import {playMode} from "common/js/config"
import {shuffle} from "common/js/util"

// 随机播放模式下，点击某一首歌需要找到他在当前已打乱的playList中的index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}

// 点击歌曲播放
export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  if(state.mode === playMode.random) {
    let randomlist = shuffle(list);
    commit(types.SET_PLAYLIST, randomlist);
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_PLAYING_STATE, true);
  // commit(types.SET_FULL_SCREEN, true);
}

// 随机播放
export const randomPlay = function ({commit},{list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomlist = shuffle(list);
  commit(types.SET_PLAYLIST, randomlist);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_PLAYING_STATE, true);
}
