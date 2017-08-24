/**
 * Created by 大白胡子 on 2017/6/27.
 */
import {getLyricsMusic} from 'api/song'
import {ERR_OK} from 'api/config'
import api from 'api/config'

export default class Song {
    constructor({id, singer, name, album, picUrl}) {
        this.id = id
        this.singer = singer
        this.name = name
        this.album = album
        this.picUrl = picUrl
    }

    getLyricsMusic() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyricsMusic(this.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
}
export function createSong(musicData) {
    return new Song({
        id: musicData.id,
        singer: filterSinger(musicData.ar),
        name: musicData.name,
        album: musicData.al.name,
        picUrl: musicData.al.picUrl,
        // url: musicUrl(musicData.id)
    })
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}
