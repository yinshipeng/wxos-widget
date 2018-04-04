/**
 * Created by yinshipeng on 2018/3/2
 */
import { isNotEmpty, objParamsToString, isFunc } from './tools'

const stream = weex.requireModule('stream')
const baseModule = weex.requireModule('WXBaseModule')
export default class Request {

    constructor ({baseUrl = '', apis, headers = {}, type = 'json', requestHandler, responseHandler}) {
        this.apis = apis
        this.baseUrl = baseUrl
        this.headers = headers
        this.type = type
        this.requestHandler = requestHandler
        this.responseHandler = responseHandler
        return this
    }

    /**
     * 获取服务对象
     * @param apiName
     */
    getCurrentAPI (apiName) {
        let api = this.apis.find(item => {
            if (item.hasOwnProperty('name') && item.name === apiName) {
                return item
            }
        })
        if (!isNotEmpty(api)) {
            throw new Error(`没有找到${apiName}服务`)
        }
        return api
    }

    install (Vue) {
        const self = this
        Vue.prototype.$request = (apiName, params, resolve, reject, progressCallback) => {
            const api = self.getCurrentAPI(apiName)
            let url = self.baseUrl + api.url, body = ''
            if (isNotEmpty(params)) {
                if (api.method.toLowerCase() === 'get') {
                    url += objParamsToString(params)
                } else if (api.method.toLowerCase() === 'post') {
                    body = JSON.stringify(params)
                } else {
                    throw new Error(`未提供${api.method}请求方式`)
                }
            }

            const options = {
                method: api.method,
                headers: self.headers,
                type: self.type,
                url,
                body
            }

            self.requestHandler().then((opts) => {
                let requestObj = Object.assign(options, opts)
                return Promise.resolve(requestObj)
            }).then((requestObj) => {
                stream.fetch(requestObj, result => {
                    self.responseHandler(result, resolve, reject)
                }, progress => {
                    if(isFunc(progressCallback)){
                        progressCallback(progress)
                    }
                })
            })

        }
    }

}
