/**
 * Created by lenovo on 2018/3/19.
 */
import {playMode} from "common/js/config"
const state = {
  singer: {},
  playing: false,    // play or pause
  fullScreen: false, // 播放器展开和收起
  playList: [],      // 支持各种播放模式（真实播放的列表）
  sequenceList: [],  // 原始播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,        // 当前播放的歌曲索引
  disc: {},           // 歌单
  topList: {},         // 排行榜单详情
  searchHistory: []
}

export default state;