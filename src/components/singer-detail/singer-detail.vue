<template>
    <transition name="slide">
        <MusicList :songs="songs" :bgImage="bgImage" :title="title"></MusicList>
    </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        let _this = this;
        if(!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then(response => {
          if(response.code === ERR_OK) {
            _this.songs = _this._normalizeSons(response.data.list);
            console.log(_this.songs);
          }
        });
      },
      _normalizeSons(list) {
        let ret = [];
        list.forEach(i => {
          let {musicData} = i;
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    components: {
      MusicList
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .slide-enter-active,.slide-leave-active
        transition: all 0.3s
    .slide-enter,.slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>