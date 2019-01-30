/**
 * Created by wang on 2017/8/31.
 */
import {ERR_OK} from "api/config"

export const dataArray = function (res) {
    if (res.code === ERR_OK) {
        let result = res.playlist
        console.log('-----------',result);
        let list = {}
        let arr = []
        for (let i = 0; i < result.tracks.length; i++) {
            if (i < 3) {
                let json = {}
                json.id = result.tracks[i].id
                json.songname = result.tracks[i].name
                json.singername = result.tracks[i].ar[0].name
                arr.push(json)
            }
        }
        list.id = result.id
        list.name = result.name
        list.copywriter = result.description
        list.picUrl = result.coverImgUrl
        list.songList = arr
        list.rank = true
        return list
    }

    return ''
}
