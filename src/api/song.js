/**
 * Created by wang on 2017/8/24.
 */
import api from 'api/config'

export function musicUrl(id) {
    return api.getMusicUrl(id).then((res) => {
        return Promise.resolve(res)
    })
}

export function getLyricsMusic(id) {
    return api.getMusicUrl(id).then((res) => {
        return Promise.resolve(res)
    })
}