<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div
                    class="progress-btn-wrapper"
                    ref="progressBtn"
                    @touchstart.prevent="progressTouchStart"
                    @touchmove.prevent="progressTouchMove"
                    @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform')
    const progressBtnWidth = 16;

    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        watch: {
            percent(newPercent){
                if (newPercent > 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                    const offsetWidth = newPercent * barWidth
                    this._offset(offsetWidth)
                }
            }
        },
        created() {
            this.touch = {}
        },
        methods: {
            progressTouchStart(e) {
                this.touch.initiated = true
                this.touch.startX = e.touches[0].clientX
                this.touch.left = this.$refs.progress.clientWidth
            },
            progressTouchMove(e) {
                if (!this.touch.initiated) {
                    return
                }
                const deltaX = e.touches[0].pageX - this.touch.startX
                const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
                this._offset(offsetWidth)
            },
            progressTouchEnd(){
                this.touch.initiated = false
                this._triggerPercent()
            },
            progressClick(e){
                this._offset(e.offsetX)
                this._triggerPercent();
            },
            _offset(offsetWidth){
                this.$refs.progress.style.width = `${offsetWidth}px`
                this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            },
            _triggerPercent(){
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const percent = this.$refs.progress.clientWidth / barWidth
                this.$emit('percentChange', percent)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~common/style/index";

    .progress-bar {
        height: 30px;
        .bar-inner {
            position: relative;
            top: 13px;
            height: 4px;
            background: rgba(200, 200, 200, .5);
        }
        .progress {
            position: absolute;
            height: 100%;
            background-color: @mainBg;
        }
        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid @bgcolor;
                border-radius: 50%;
                background-color: @songListBg;
            }
        }

    }
</style>