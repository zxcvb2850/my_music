/**
 * Created by wang on 2017/8/30.
 */
import {mapGetters} from "vuex"

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