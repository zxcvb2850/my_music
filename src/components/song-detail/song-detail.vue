<template>
    <transition name="scale">
        <music-list :title="title" :bgImage="bgImage" :describe="describe" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from 'components/music-list/music-list'
    import api from 'api'
    import {mapGetters} from 'vuex'
    import {ERR_OK} from 'api/config'
    import {createSong} from 'common/js/song'

    export default {
        computed: {
            title(){
                return this.singer.name
            },
            bgImage(){
                return this.imageUrl()
            },
            describe(){
                return this.singer.copywriter
            },
            ...mapGetters([
                'singer'
            ])
        },
        data(){
            return {
                songs: []
            }
        },
        created(){
            this._getDetail();
        },
        methods: {
            _getDetail(){
                if (!this.singer.id) {
                    this.$router.push('/recommend');
                    return
                }
                api.getSongDetails(this.singer.id).then((res) => {
                    res = res.data;
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.playlist.tracks);
                        console.log(res.playlist.tracks)
                        console.log(this.songs)
                    }
                })
            },
            _normalizeSongs(list){
                let ret = [];
                list.forEach((musicData) => {
                    if (musicData.id) {
                        ret.push(createSong(musicData));
                    }
                })
                return ret;
            },
            imageUrl(){
                if (this.singer.picUrl) {
                    return this.singer.picUrl
                } else {
                    return this.singer.coverImgUrl
                }
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style lang="less" scoped>
    .scale-enter-active, .scale-leave-active {
        transition: all 0.3s;
        transform: scale(1,1);
    }

    .scale-enter, .scale-leave-to {
        transform: scale(0,0);
        opacity:0;
    }
</style>
