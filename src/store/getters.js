/**
 * Created by lenovo on 2018/3/19.
 */

export const singer = state => state.singer;
// 播放器
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playList = state => state.playList;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}