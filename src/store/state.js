/**
 * Created by lenovo on 2018/3/19.
 */
import {playMode} from "common/js/config"
const state = {
  singer: {},
  playing: false,    // play or pause
  fullScreen: false, // 播放器展开和收起
  playList: [],      // 播放列表
  sequenceList: [],  //支持各种播放模式
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,        // 当前播放的歌曲索引

}

export default state;