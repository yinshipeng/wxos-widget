/**
 * Created by yinshipeng on 2018/3/5
 */
import {
    getBase64
} from './tools'

const baseModule = weex.requireModule('WXBaseModule')
const wxYituModule = weex.requireModule('WXYITUModule')
const loadModule = weex.requireModule('WXLoadingModule')
const wxPayModule = weex.requireModule('WXPayModule')
const Native = Object.create(null)

Native.install = (Vue) => {
    Vue.prototype.$native = {
        /**
         * 打印日志
         * @param args
         */
        log(args) {
            baseModule.log(JSON.stringify(args))
        },

        /**
         * 呼叫电话
         * @param mobile
         */
        callPhoneWithNative(mobile = '') {
            baseModule.callPhoneWithNative(mobile)
        },

        /**
         * 调用相机
         * @param callback
         */
        useCamera(callback) {
            baseModule.useCamera(result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 调取相机进行身份证扫描
         * @param type
         * @param callback
         */
        clickBtnWithCardCallback(type, callback) {
            wxYituModule.clickBtnWithFace(type, result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 调用相册以及摄像头
         * @param callback
         */
        useCameraOrPhoto(callback) {
            baseModule.useCameraOrPhoto(result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 验证是否拥有访问设备通讯录的权限
         * @param callback
         */
        requestAuthorizationAddressBookCallback(callback) {
            baseModule.requestAuthorizationAddressBookCallback(result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 获取设备通讯录
         * @param callback
         */
        getContactsCallback(callback) {
            baseModule.getContactsCallback(result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 打开设备设置
         */
        openSetting() {
            baseModule.openSetting()
        },

        /**
         * 调用native分享到微信朋友圈
         * @param  {String} shareLink    分享链接
         * @param  {String} title        标题
         * @param  {String} content      内容
         * @param  {String} base64Bitmap base64图片
         * @return null
         */
        requestShare(shareLink, title, content, base64Bitmap) {
            baseModule.requestShare(shareLink, title, content, base64Bitmap)
        },

        /**
         * 调用native分享到微信朋友圈(自定义UI)
         * @param  {String} shareLink    分享链接
         * @param  {String} title        标题
         * @param  {String} content      内容
         * @param  {String} base64Bitmap base64图片
         * @param  {String} shareType '0' 分享到微信， '1' 分享到朋友圈
         * @return null
         */
        requestShareByWeex(shareLink, title, content, base64Bitmap, shareType) {
            baseModule.requestShareByWeex(shareLink, title, content, base64Bitmap, shareType)
        },

        /**
         * 根据内容生成二维码
         * @param  {String} content 内容
         */
        createQRcode(content, callback) {
            baseModule.createQRcode(content, result => {
                if (callback) {
                    callback(getBase64(result))
                }
            })
        },

        /**
         * 热加载更新APP
         * @param  {String} donwloadURL
         * @return null
         */
        loadManage(donwloadURL, callback) {
            loadModule.loadManage(donwloadURL, result => {
                if (callback) {
                    callback(result)
                }
            })
        },

        /**
         * 获取APP最新版本号
         */
        getAppVersion(callback) {
            baseModule.getAppVersion((version) => {
                callback(version)
            })
        },

        clearBeforeController() {
            baseModule.clearBeforeController()
        },

        /**
         * 支付宝支付
         * @param {*} signature 
         * @param {*} callback 
         */
        alipay(signature, callback) {
            wxPayModule.alipay(signature, (result) => {
                callback(result)
            })
        },

        /**
         * 用默认浏览器打开
         * @param url
         */
        openBrowser(url) {
            baseModule.openBrowser(url);
        },

        /**
         * 获取壳子版本号
         * @param {} version
         */
        getAppFrameVersion(callback) {
            baseModule.getAppFrameVersion((version) => {
                callback(version);
            });
        },

        /**
         * 调起摄像头并裁剪
         * @param {} callback 
         */
        useCameraOrPhotoWithCut(callback) {
            baseModule.useCameraOrPhotoWithCut((img) => {
                callback(img);
            });
        }

    }
}

Vue.use(Native)