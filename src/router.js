/**
 * Created by yinshipeng on 2018/2/28
 */
import { isNotEmpty, objParamsToString } from './tools'

const baseModule = weex.requireModule('WXBaseModule')
const navigator = weex.requireModule('navigator')

export default class Router {

    constructor ({routes, serveModel, bundleDir}) {
        this.routes = routes
        this.serveModel = serveModel
        this.bundleDir = bundleDir
    }

    /**
     * object 转 URL 参数
     * {id:1, name:123} => '?id=1&name=123'
     * @param obj
     * @returns {string}
     */
    setParams (obj,encode=true) {
        if(!isNotEmpty(obj)) return ''
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
     * URL参数转成对象
     * '{str}?name=aa' => {name: 'aa'}
     * @param obj
     * @returns {object}
     */
    getParams (url) {
        let result = {}
        if (isNotEmpty(url) && url.indexOf('?') > -1) {
            let params = url.substring(url.indexOf('?') + 1).split('&')
            for (var i = 0; i < params.length; i++) {
                result[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
            }
        }
        return result
    }

    /**
     * 获取js路径
     * @param route
     * @returns {*}
     */
    getWeexRoute (route) {
        const item = this.routes.find(item => {
            if (item.path === route.path || item.path === route) {
                return item
            }
        })
        if (!item) {
            throw new Error(`routes路由表中不存在该路径${route.path}`)
        }
        let bundleUrl = weex.config.bundleUrl
        let bundleBasePath = bundleUrl.substr(0, bundleUrl.indexOf(this.bundleDir)) + this.bundleDir
        const component = bundleBasePath + item.component
        return { path: item.path, component }
    }

    /**
     * 获取URL路由跳转的路径并拼接参数
     * @param  {Object} weexRoute weex-routes[item]
     * @param  {String} query url参数以？开头
     * @return {String} fileName or filePath
     */
    getRoutePath (weexRoute, params = '') {
        let filePath = ''
        if (this.serveModel === 'SERVER') {
            filePath = weexRoute.component + params
        } else if (this.serveModel === 'APP_FILE') {
            const fileName = weexRoute.component.substring(weexRoute.component.lastIndexOf('/') + 1)
            filePath = fileName + params
        }
        return filePath
    }

    install (Vue) {
        const self = this
        let url = weex.config.bundleUrl, query = {}
        if (this.serveModel === 'APP_FILE') {
            url = this.setParams(weex.config.query, false)
        }
        query = this.getParams(url)
        Vue.prototype.$route = {query}
        Vue.prototype.$router = {
            push (route, destroyed = false) {
                const currentRoute = self.getWeexRoute(route)
                let routeParams
                if (route.query) {
                    routeParams = objParamsToString(route.query)
                }
                const filePath = self.getRoutePath(currentRoute, routeParams)
                if (destroyed) {
                    baseModule.pushWithNativeBack(filePath)
                } else {
                    baseModule.pushWithNative(filePath, '1')
                }
            },
            back () {
                baseModule.weexPop && baseModule.weexPop()
                navigator.pop({animated: 'true'})
            }
        }
    }
}