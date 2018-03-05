/**
 * Created by yinshipeng on 2018/3/5
 */
import { isObject } from './tools'

const storage = weex.requireModule('storage')

var Storage = Object.create(null)

Storage.install = (Vue) => {
    Vue.prototype.$storage = {
        setItem (key, data, callback) {
            if (isObject(data)) {
                data = JSON.stringify(data)
            }
            storage.setItem(key, data, callback)
        },

        getItem (key, callback) {
            storage.getItem(key, event => {
                try {
                    const data = JSON.parse(event.data)
                    callback(data)
                } catch (e) {
                    callback(event.data)
                }
            })
        },
        removeItem (key, callback) {
            storage.removeItem(key, (event) => {
                if (event.result === 'success') {
                    callback(event.data)
                } else {
                    throw new Error(`删除${key}失败`)
                }
            })
        },

        length (callback) {
            storage.length((event) => {
                if (event.result === 'success') {
                    callback(event.data)
                } else {
                    throw new Error('返回本地存储的数据中所有存储项数量的整数执行错误')
                }
            })
        },

        getAllKeys (callback) {
            storage.getAllKeys((event) => {
                if (event.result === 'success') {
                    callback(event.data)
                } else {
                    throw new Error('返回一个包含全部已存储项键名的数组执行错误')
                }
            })
        }
    }
}

Vue.use(Storage)