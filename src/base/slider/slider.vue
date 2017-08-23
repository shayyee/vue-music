<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item, index) in dots" :class="{active: currentIndex === index}"></span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    props: {
      loop: { // 是否循环播放
        type: Boolean,
        default: true
      },
      autoPlay: { // 是否自动播放
        type: Boolean,
        default: true
      },
      interval: { // 播放间隔时间
        type: Number,
        default: 3000
      }
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(isResize) {
        /**
         * 计算slider图片的宽度
         */
        this.children = this.$refs.sliderGroup.children
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + "px"
          width += sliderWidth
        }
        if (this.loop && !isResize) { // 如果循环播放的话，复制一个，width*2
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + "px"
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _initSlider() {
        /**
         * 初始化slider
         */
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,    // 当快速滑动时是否开启滑动惯性
          snap: true,
          snapLoop: this.loop,// 是否可以无缝循环轮播
          snapThreshold: 0.3, //  用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          snapSpeed: 400,     // 轮播图切换的动画时间
        })
        //滚动结束时触发
        this.slider.on('scrollEnd', () => {
          /**
           * 当 snap 为 true 时，获取滚动的当前页，返回的对象结构为 {x, y, pageX, pageY},
           * 其中 x,y 代表滚动横向和纵向的位置；pageX，pageY 表示横向和纵向的页面索引
           */
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .slider
        min-height: 1px
        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                img
                    display: block
                    width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>