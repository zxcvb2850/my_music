/**
 * Created by 大白胡子 on 2017/6/27.
 */
import {ERR_OK} from 'api/config'
import api from 'api/index'

export default class Song {
    constructor({id, singer, name, album, picUrl, url, lyric}) {
        this.id = id
        this.singer = singer
        this.name = name
        this.album = album
        this.picUrl = picUrl
        this.url = url
        this.lyric = lyric
    }
}
export function createSong(musicData) {
    return new Song({
        id: musicData.id,
        singer: filterSinger(musicData.ar),
        name: musicData.name,
        album: musicData.al.name,
        picUrl: musicData.al.picUrl,
        url: getMusic(musicData.id, 'url'),
        lyric: getMusic(musicData.id, 'lyric')
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

function getMusic(id, type) {
    let url = []
    let lyric = []

    if (!id) {
        return ''
    }
    api.getMusicUrl(id).then((res) => {
        res = res.data
        if (res.code === ERR_OK) {
            url.push(res.data[0].url)
        }
    })
    api.getLyricsMusic(id).then((res) => {
        res = res.data
        if (res.code === ERR_OK) {
            lyric.push(res.lrc.lyric)
        }
    })

    if (type === 'url') {
        return url
    }
    if (type === 'lyric') {
        return lyric
    }
}

function musicLyric(id) {

}