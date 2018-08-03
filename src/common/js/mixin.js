import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from "common/js/config"
import {shuffle} from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList methods');
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ]),
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
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
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
    }
  },
  computed: {
    ...mapGetters(['searchHistory']),
  },
  methods: {
    ...mapActions(['saveSearchHistory','clearSearchHistory']),
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query) {
      this.query = query
    },
    addQuery(item) {
      this.$refs.searchBox.setQuery(item)
    },
  }
}