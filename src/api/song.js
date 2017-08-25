/**
 * Created by wang on 2017/8/25.
 */
import api from 'api/index'

export function getUrl(id) {
    return api.getMusicUrl(id).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getLyric(id){
    return api.getLyricsMusic(id).then((res)=>{
        return Promise.resolve(res)
    })
}