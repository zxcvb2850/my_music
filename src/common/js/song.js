/**
 * Created by 大白胡子 on 2017/6/27.
 */
import {ERR_OK} from 'api/config'
import {getUrl, getLyric} from 'api/song'

export default class Song {
    constructor({id, singer, name, album, alia, picUrl, url}) {
        this.id = id                                    //音乐ID
        this.singer = singer                            //歌手姓名
        this.name = name                                //歌曲名字
        this.album = album                              //专辑的名字
        this.alia = alia                                //歌曲来自哪里
        this.picUrl = picUrl                            //歌曲图片
        this.url = url                                  //歌曲的URL
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.id).then((res) => {
                res = res.data
                if (res.code === ERR_OK) {
                    if(res.lrc === undefined){
                        reject('no music lyric')
                    }
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
    function getUrlq() {
        if (!musicData.id) {
            reject('no music URL')
        }
        return new Promise((resolve, reject) => {
            getUrl(musicData.id).then((res) => {
                if (res.code === ERR_OK) {
                    resolve(res.data[0].url)
                } else {
                    reject('no music URL')
                }
            })
        })
    }

    function musicUrl() {
        let MusicUrl = [];
        getUrlq().then((url) => {
            MusicUrl.push(url)
        })
        return MusicUrl
    }

    return new Song({
        id: musicData.id,
        singer: filterSinger(musicData.ar),
        name: musicData.name,
        album: musicData.al.name,
        alia: musicData.alia[0],
        picUrl: musicData.al.picUrl,
        url: musicUrl()
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
