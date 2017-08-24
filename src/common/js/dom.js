/**
 * Created by 大白胡子 on 2017/6/22.
 */
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}

function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}

let elementStyle = document.querySelector('div').style

let vendor = (() => {
    let transformName = {
        webkit: 'webkitTransform',
        Mox: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for (var key in transformName) {
        if (elementStyle[transformName[key]] !== 'undefined') {
            return key
        }
    }

    return false
})()

export function prefixStyle(style) {
    if (!vendor) {
        return false
    }

    if (vendor === 'standard') {
        return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}