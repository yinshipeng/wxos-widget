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
    constructor ({routes, apis, broadcasts}) {
        if (!instance) {
            Vue.use(new Router(routes))
            Vue.use(new Request(apis))
            Vue.use(new Broadcast(broadcasts))
            instance = this
        }
        return instance
    }
}