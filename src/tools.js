/**
 * Created by yinshipeng on 2018/2/28
 */
import { isNaN, isNumber, isBoolean, isEmpty, isObject as isObj } from 'lodash'

/**
 * 非空判断
 * @param arg
 * @returns {boolean}
 */
export function isNotEmpty (arg) {
    if (!isNaN(arg) && isNumber(arg)) {
        return true
    } else if (isBoolean(arg)) {
        return true
    }
    return !isEmpty(arg)
}

/**
 * object 转 URL 参数
 * {id:1, name:123} => '?id=1&name=123'
 * @param obj     参数对象
 * @param encode  是否需要编码 默认编码
 * @returns {string}
 */
export function objParamsToString (obj, encode = true) {
    if (!isNotEmpty(obj)) return ''
    let url = '?'
    for (let key in obj) {
        if (obj[key] !== null) {
            let val = encode ? encodeURIComponent(obj[key]) : obj[key]
            url += (key + '=' + val + '&')
        }
    }
    return url.substring(0, url.lastIndexOf('&'))
}

/**
 * 是否为对象
 * @param arg
 * @returns {boolean}
 */
export function isObject (arg) {
    return isObj(arg)
}

/**
 * string startsWith
 * @param  {String} str
 * @param  {String} reg
 * @return {Boolean}
 */
export function startsWith (str, reg) {
    const regExp = new RegExp('^' + reg)
    return regExp.test(str)
}

/**
 * 添加base64需要的头部分
 * @param  {String} base64Str 后端返回的数据
 * @return {String}           显示的图片
 */
export function getBase64 (base64Str) {
    if (isEmpty(base64Str)) return base64Str
    if (!startsWith(base64Str, 'http://') && !startsWith(base64Str, 'https://')) {
        base64Str = 'data:image/jpeg;base64,' + base64Str
    }
    return base64Str
}