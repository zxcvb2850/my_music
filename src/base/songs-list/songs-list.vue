<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song, index) in songs" @click="selectItem(song, index)">
                <div class="content">
                    <div class="serial">
                        <p class="number">{{index + 1}}</p>
                    </div>
                    <div class="author">
                        <h2 class="name" v-html="song.name"></h2>
                        <p class="singer">{{song.singer}}—{{song.album}}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            }
        },
        methods:{
            selectItem(item,index){
                this.$emit('select',item,index)
            }
        }
    }
</script>
<style scoped lang="less">
    @import '~common/style/index';

    @ItemHeight: 60px;

    .song-list {
        .item {
            align-items: center;
            box-sizing: border-box;
            height: @ItemHeight;
            font-size: 16px;
            .content {
                display: flex;
                line-height: 20px;
                overflow: hidden;
                .serial {
                    flex: 60px 0 0;
                    text-align: center;
                    height: @ItemHeight;
                    line-height: @ItemHeight;
                    .number {
                        color: @textColor;
                        font-size: @fontSizeMin;
                    }
                }
                .author {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-right: 10px;
                    .no-wrap();
                    .border-1px(@divisionLine);
                    .name {
                        .no-wrap();
                        color: @blackColor;
                        font-size: @fontSizeMin;
                        font-weight: 500;
                    }
                    .singer {
                        font-size: @fontSizeDesc;
                        .no-wrap();
                        margin-top: 4px;
                        color: @iconColor;
                    }
                }
            }
        }
    }
</style>
