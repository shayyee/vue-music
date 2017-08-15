<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import {addClass} from 'common/js/dom'
    export default {
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
        mounted() {
            console.log(2);
            setTimeout(() => {
                this._setSliderWidth()
                this._initSlider()
            }, 20)
        },
        methods: {
            _setSliderWidth() {
                /**
                 * 计算slider图片的宽度
                 */
                this.children = this.$refs.sliderGroup.children
                let width = 0;
                let sliderWidth = this.$refs.slider.clientWidth
                for(let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item')
                    child.style.width = sliderWidth + "px"
                    width += sliderWidth
                }
                if(this.loop) { // 如果循环播放的话，复制一个，width*2
                    width += 2 * sliderWidth
                }
                this.$refs.sliderGroup.style.width = width + "px"
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
                    click: true
                })
                this.slider.on('scrollEnd', () => {

                })
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