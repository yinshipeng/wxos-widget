/**
 * Created by yinshipeng on 2018/2/28
 */
import { isNotEmpty, objParamsToString } from './tools'

const baseModule = weex.requireModule('WXBaseModule')

export default class Router {

    constructor ({routes, options}) {
        this.routes = routes
        this.options = options
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
        let bundleBasePath = bundleUrl.substr(0, bundleUrl.indexOf(this.options['BASE_BUNDLE_DIR'])) + this.options['BASE_BUNDLE_DIR']
        item.component = bundleBasePath + item.component
        return item
    }

    /**
     * 获取URL路由跳转的路径并拼接参数
     * @param  {Object} weexRoute weex-routes[item]
     * @param  {String} query url参数以？开头
     * @return {String} fileName or filePath
     */
    getRoutePath (weexRoute, params = '') {
        let filePath = ''
        if (this.options['SERVE_MODEL'] === 'SERVER') {
            filePath = weexRoute.component + params
        } else if (this.options['SERVE_MODEL'] === 'APP_FILE') {
            const fileName = weexRoute.component.substring(weexRoute.component.lastIndexOf('/') + 1)
            filePath = fileName + params
        }
        return filePath
    }

    install (Vue) {
        const self = this
        let url = weex.config.bundleUrl, params = {}
        if (this.options['SERVE_MODEL'] === 'APP_FILE') {
            url = this.setParams(weex.config.query, false)
        }
        params = this.getParams(url)
        Vue.prototype.$route = {params}
        Vue.prototype.$router = {
            push (route, destroyed = false) {
                const currentRoute = self.getWeexRoute(route)
                let routeParams
                if (route.params) {
                    routeParams = objParamsToString(route.params)
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