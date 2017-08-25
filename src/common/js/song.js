/**
 * Created by 大白胡子 on 2017/6/27.
 */
import {ERR_OK} from 'api/config'
import {getUrl, getLyric} from 'api/song'

export default class Song {
    constructor({id, singer, name, album, picUrl}) {
        this.id = id
        this.singer = singer
        this.name = name
        this.album = album
        this.picUrl = picUrl
    }

    getUrl() {
        if (this.url) {
            return Promise.resolve(this.url)
        }

        return new Promise((resolve, reject) => {
            getUrl(this.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.url = res.data[0].url
                    resolve(this.url)
                } else {
                    reject('no music url')
                }
            })
        })
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.id).then((res) => {
                res = res.data
                console.log(res)
                if (res.code === ERR_OK) {
                    this.lyric = res.lrc.lyric
                    resolve(this.lyric)
                } else {
                    reject('no music lyric')
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
        picUrl: musicData.al.picUrl
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