<template>
    <transition name="slide">
        <MusicList :songs="songs" :title="title" :bg-image="bgImg"></MusicList>
    </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'disc'
      ]),
      title() {
        return this.disc.dissname;
      },
      bgImg() {
        return this.disc.imgurl;
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        let _this = this;
        if(!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then(res => {
          if(res.code === ERR_OK) {
            _this.songs = _this._normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(musicData => {
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