/**
 * Created by lenovo on 2018/3/19.
 */

import * as types from './mutation-types'
import {playMode} from "common/js/config"
import {shuffle} from "common/js/util"
import {saveSearch} from "common/js/cache"

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
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
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

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 将要插入的歌曲是否在播放列表中, 存在则返回索引
  let fpIndex = findIndex(playlist, song)
  // 插入的歌曲 索引需+1
  currentIndex++
  // 插入播放列表
  playlist.splice(currentIndex, 0, song)
  if(fpIndex > -1) {
    // 插入位置大于原先列表中位置
    if(currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 获取sequenceList插入位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if(fsIndex > -1) {
    if(currentSIndex > fsIndex) {
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

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SERACH_HISTORY, saveSearch(query))
}
