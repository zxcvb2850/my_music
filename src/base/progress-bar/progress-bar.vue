<template>
    <div class="progress-bar" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress" percen="{percent}"></div>
            <div class="progress-btn-wrapper" ref="progressBtn">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
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
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this.$refs.progress.style.width = `${offsetWidth}px`
                this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
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