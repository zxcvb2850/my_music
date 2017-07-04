<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(cur,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    data(){
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted(){
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      window.addEventListener('resize',()=>{
          if(!this.slider){
              return;
          }

          this._setSliderWidth(true);
          this.slider.refresh();
      })
    },
    methods: {
      _setSliderWidth(isResize){
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }

        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }

        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,          //横向滚动
          scrollY: false,         //禁止纵向滚动
          momentum: false,        //禁止惯性滚动
          snap: true,              //该属性是给 slider 组件使用的，普通的列表滚动不需要配置
          snapLoop: this.loop,     //是否循环滚动
          snapThreshold: 0.3,      //用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          snapSpeed: 400          //切换动画的速度
        });

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;

          if(this.autoPlay){
              clearTimeout(this.timer);
              this._play();
          }
        })
      },
      _initDots(){
        this.dots = new Array(this.children.length);
      },
      _play(){
        let pageIndex = this.currentPageIndex + 1;
        if (this.loop) {
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/style/index.less';

  .slider {
    min-height: 1px;
    .slider-group {
      position: relative;
      overflow: hidden;
      .slider-item {
        float: left;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        overflow: hidden;
      }
      img {
        display: block;
        width: 100%;
      }
    }
    .dots {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: @textColor;
        &.active {
          background-color: @mainBg;
        }
      }
    }
  }
</style>
