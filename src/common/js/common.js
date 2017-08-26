/**
 * Created by wang on 2017/8/26.
 */
export function Zerofill(num) {
    if (num < 10) {
        return num = '0' + num
    }
    return num
}