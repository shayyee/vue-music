<template>
  <div class="singer">
    <listview :data="singers"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  const HOT_NAME = '热门';
  const HOT_SINGER_LENGTH = 10;
  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        let _this = this;
        getSingerList().then(response => {
          if(response.code === ERR_OK) {
            _this.singers = _this._normalizeSinger(response.data.list);
          }
        });
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          if(index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }
          const key = item.Findex;
          if(!map[key]) { // 如果没有 先创建
            map[key] = {
              title: key,
              items: []
            };
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }));
        });
        // 为了得到有序列表，需要处理map
        let hot = [];
        let letter = [];
        for(let key in map) {
          let val = map[key];
          if(val.title.match(/[a-zA-Z]/)) {
            letter.push(val);
          } else if(val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        letter.sort((a,b) => {  // 按a-z的顺序排列
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(letter);
      }
    },
    components: {
      Listview
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top: 88px
    bottom: 0px
    width: 100%
</style>
