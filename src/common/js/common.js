/**
 * Created by wang on 2017/8/26.
 */
/*补零*/
export function Zerofill(num) {
    if (num < 10) {
        return num = '0' + num
    }
    return num
}

/*打乱数组*/
function randomSort(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function RandomArr(arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = randomSort(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }

    return _arr
}

/*查找当前索引*/
export function FindIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}