/**
 * Created by yinshipeng on 2018/2/28
 */
import Router from './src/router'
import Request from './src/request'
import './src/broadcast'
import './src/tools'
import './src/native'
import './src/storage'

let instance = null
export default class Widget {
    constructor ({routes, apis, options}) {
        if (!instance) {
            Vue.use(new Router(routes, options))
            Vue.use(new Request(apis))
            instance = this
        }
        return instance
    }
}