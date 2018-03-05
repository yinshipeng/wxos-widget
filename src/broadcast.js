/**
 * Created by yinshipeng on 2018/3/5
 */

export default class Broadcast {
    constructor (options) {
        this.options = options
    }

    install () {
        const selt = this
        Vue.prototype.$broadcast = {
            postMessage (broadcastChannelName, message = '') {
                if (!self.options.hasOwnProperty(broadcastChannelName)) {
                    throw new Error('broadcastChannel is not exist!')
                } else {
                    let broadcastChannel = new BroadcastChannel(broadcastChannelName)
                    broadcastChannel.postMessage(message)
                }
            },

            onMessage (broadcastChannelName, fn) {
                if (!selt.options.hasOwnProperty(broadcastChannelName)) {
                    throw new Error('broadcastChannel is not exist!')
                } else {
                    let broadcastChannel = new BroadcastChannel(broadcastChannelName)
                    broadcastChannel.onmessage = fn
                    return broadcastChannel
                }
            }
        }
    }
}