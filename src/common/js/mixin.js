/**
 * Created by wang on 2017/8/30.
 */
import {mapGetters, mapMutations} from "vuex"
import {playMode} from "common/js/config"
import {RandomArr, FindIndex} from "common/js/common"

export const playlistMixin = {
    watch: {
        playList(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    mounted() {
        this.handlePlaylist(this.playList)
    },
    activated() {
        this.handlePlaylist(this.playList)
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    },
    computed: {
        ...mapGetters([
            'playList'
        ])
    }
}

export const playerMixin = {
    computed: {
        iconMode(){
            return this.mode === playMode.sequence ? 'icon-loop' : this.mode === playMode.loop ? 'icon-loop_single' : 'icon-random'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playList',
            'mode'
        ])
    },
    methods: {
        changMode(){
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = RandomArr(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list){
            let index = FindIndex(list, this.currentSong);
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        })
    }
}