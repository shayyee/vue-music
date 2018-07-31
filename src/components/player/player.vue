<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image"/>
                </div>
                <!--顶部 返回按钮 歌曲名称 歌手名称-->
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <!--中部 唱片-->
                <div class="middle"
                     @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div :class="[playing?'play':'play pause','cd']">
                                <img :src="currentSong.image" alt="" class="image"/>
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric" v-html="playingLyric"></div>
                        </div>
                    </div>
                    <scroll class="middle-r"
                            ref="lyricList"
                            :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text"
                                   :class="{'current': currentLineNum === index}"
                                   v-for="(line,index) in currentLyric.lines" v-html="line.txt"></p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <!--底部 操作区-->
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span :class="[currentShow ==='cd'?'active':'','dot']"></span>
                        <span :class="[currentShow ==='lyric'?'active':'','dot']"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i @click="togglePlaying" :class="[playing ? 'icon-pause':'icon-play']"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <!--小唱片-->
                <div class="icon">
                    <img :class="[playing?'play':'play pause']" width="40" height="40" :src="currentSong.image"/>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <!--播放/暂停-->
                <div class="control">
                    <progress-cycle :radius="32" :percent="percent">
                        <i @click.stop="togglePlaying"
                           :class="[playing ? 'icon-pause-mini':'icon-play-mini','icon-mini']"></i>
                    </progress-cycle>
                </div>
                <!--点击查看播放列表-->
                <div class="control" @click="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio ref="audio" :src="audioUrl"
               @canplay="ready" @error="error"
               @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
  // 可能的bug： mini情况下暂停再播放，如果之前在全屏情况下是歌词部分则重新全屏无法跳转到当前行歌词
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import {getVKey} from 'api/singer'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCycle from 'base/progress-cycle/progress-cycle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'common/js/lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    components: {
      ProgressBar,
      ProgressCycle,
      Scroll,
      Playlist
    },
    created() {
      // created 中定义的变量不会添加getter/setter
      this.touch = {}
    },
    data() {
      return {
        audioUrl: '',
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0, // 当前歌词所在的行
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence'
          : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return;
        }
        let _this = this;
        _this.songReady = false;
        getVKey(newSong.mid).then(res => {
          let vkey = res.data.items[0].vkey;
          _this.audioUrl = `${newSong.url}?vkey=${vkey}&guid=2155542447&uin=0&fromtag=66`;
          if(_this.currentLyric) {
            _this.currentLyric.stop();
          }
          _this.$nextTick(() => {
            _this.$refs.audio.play();
            _this.getLyric();
          });
        })
      },
      playing(val) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          val ? audio.play() : audio.pause();
        })
      },
      fullScreen(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.lyricList.refresh()
          }, 20)
        }
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0 0) scale(1)`
          }
        };
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      togglePlaying() {
        if (!this.songReady) return;
        this.setPlayingState(!this.playing);
        if(this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if(this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      prev() {
        if (!this.songReady) return;
        if(this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      next() {
        if (!this.songReady) return;
        if(this.playList.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      ready() {
        this.songReady = true;
      },
      // 歌曲加载失败
      error() {
        this.songReady = true;
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      formatTime(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;
      },
      onProgressChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = currentTime;
//        if(!this.playing) {
//          this.togglePlaying();
//        }
        if(this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      changeMode() {
        const mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        // 保证在playlist改变时，当前正在播放的歌曲不变，即currentSong不变
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id;
        });
        this.setCurrentIndex(index);
      },
      getLyric() {
//        this.currentLineNum = 0;
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if(this.playing) {
            this.currentLyric.play();
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if(lineNum > 5) {
          let lineEle = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEle, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      middleTouchStart(e) {
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e) {
        if(!this.touch.initiated) return;
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
//        console.log("delta: ", deltaX, deltaY);
        // 纵向滚动
        if(Math.abs(deltaY) > Math.abs(deltaX)) return;
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth/window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchEnd() {
        this.touch.initiated = false;
        let offsetWidth;
        let opacity;
        // 从右向左划
        if(this.currentShow === 'cd') {
          if(this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
          //从左向右滑
        } else {
          if(this.touch.percent < 0.8) {
            offsetWidth = 0;
            this.currentShow = 'cd';
            opacity = 1;
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      },
      showPlaylist() {
        this.$refs.playlist.show()
      },
      // 用0补位，n为补零后的字符串长度
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      // 获取动画相关元素初始位置和缩放尺寸
      _getPosAndScale() {
        // 小唱片width
        const targetWidth = 40;
        // 小唱片中心点相对于left=0的偏移量
        const paddingLeft = 40;
        // 小唱片中心点相对于bottom=0的偏移量
        const paddingBottom = 30;
        // 大唱片上边界相对于top=0的偏移量
        const paddingTop = 80;
        // 大唱片width
        const width = window.innerWidth * 0.8;
        // 初始缩放比例
        const scale = targetWidth / width;
        // 初始小唱片中心相对于大唱片中心的x偏移量
        const x = -(window.innerWidth / 2 - paddingLeft);
        // 初始小唱片中心相对于大唱片中心的y偏移量
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

        return {x, y, scale}
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%
                            &.play
                                animation: rotate 20s linear infinite
                            &.pause
                                animation-play-state: paused
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center
                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l
                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                .dot-wrapper
                    text-align: center
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-l
                            text-align: left
                        &.time-r
                            text-align: right
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        color: $color-theme
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity: 0
            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px
                img
                    border-radius: 50%
                    &.play
                        animation: rotate 10s linear infinite
                    &.pause
                        animation-play-state: paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d
                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>