/**
 * Created by yinshipeng on 2018/3/5
 */
export default class Broadcast {
    constructor (options) {
        this.options = options
    }

    install () {
        const self = this
        Vue.prototype.$broadcast = {
            postMessage (broadcastChannelName, message = '') {
                if (!self.options.includes(broadcastChannelName)) {
                    throw new Error('broadcastChannel is not exist!')
                } else {
                    let broadcastChannel = new BroadcastChannel(broadcastChannelName)
                    broadcastChannel.postMessage(message)
                }
            },

            onMessage (broadcastChannelName, fn) {
                if (!self.options.includes(broadcastChannelName)) {
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