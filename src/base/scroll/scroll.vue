<template>
    <div class="wrapper" ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            data: {
                type: Array,
                default: null
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            pullUp: {
                type: Boolean,
                default: false
            },
            pullDown: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                pulldownTip: {
                    text: "下拉刷新",
                    icon: ""
                }
            }
        },
        mounted(){
            setTimeout(() => {
                this._initScroll();
            }, 20)
        },
        methods: {
            _initScroll(){
                if (!this.$refs.wrapper) {
                    return;
                }

                this.scroll = new BScroll(this.$refs.wrapper, {
                    click: this.click,
                    probeType: this.probeType
                })

                //是否派发滚动事件
                if (this.listenScroll) {
                    let me = this
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos)
                    })
                }

                // 是否派发滚动到底部事件，用于上拉加载
                if (this.pullUp) {
                    this.scroll.on('scrollEnd', () => {
                        if (this.scroll.y <= (this.scroll.maxScrollY + 20)) {
                            this.$emit('pullUp');
                        }
                    })
                }
                // 是否派发顶部下拉事件，用于下拉刷新
                if (this.pullDown) {
                    this.scroll.on('touchend', (pos) => {
                        if (pos.y > 50) {
                            this.$emit('pullDown');
                        }
                    })
                }
            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            disable(){
                this.scroll && this.scroll.disable()
            },
            refresh(){
                setTimeout(() => {
                    this.scroll && this.scroll.refresh()
                })
            }
        },
        watch: {
            data(){
                setTimeout(() => {
                    this.refresh();
                }, 20)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
