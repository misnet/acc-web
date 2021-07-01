import imageNotAvailable from "@/assets/image_not_available.png";
import _ from "lodash";
import { createIntl, createIntlCache, getLocale } from 'umi';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';
/**
 * 对json对象按key进行排序，需要lodash程序支持
 */
export function sortKeysBy(obj, comparator) {
    let keys = _.sortBy(_.keys(obj), function (key) {
        return comparator ? comparator(obj[key], key) : key;
    });
    let newObj = {};
    _.map(keys, function (key) {
        newObj[key] = obj[key];
    });
    return newObj;
}

/**
 * 是否是网址
 * @param {} path
 */
export function isUrl(path) {
    /* eslint no-useless-escape:0 */
    const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
    return reg.test(path);
}
/**
 * AliOSS 上传
 * @param {} option
 */
export function ossUpload(option = {}) {
    let {
        ossSetting,
        file,
        targetPath,
        objectName,
        onFailure,
        onSuccess,
        onProgress
    } = option;
    if (!ossSetting || !file) {
        throw new Error("上传参数不齐全");
    }
    if (!targetPath) {
        targetPath = "";
    }
    //自动生成名称
    if (!objectName && file.name) {
        const fileExtension = file.name
            .split(".")
            .pop()
            .toLowerCase();
        objectName = generateUUID() + "." + fileExtension;
    }
    try {
        const ossClient = new window.OSS.Wrapper({
            accessKeyId: ossSetting.Credentials.AccessKeyId,
            accessKeySecret: ossSetting.Credentials.AccessKeySecret,
            stsToken: ossSetting.Credentials.SecurityToken,
            region: ossSetting.Bucket.endpoint.replace(".aliyuncs.com", ""),
            bucket: ossSetting.Bucket.name
        });
        return new Promise((resolve, reject) => {
            const targetName = (targetPath + objectName).replace("//", "/");
            ossClient
                .multipartUpload(targetName, file, { progress: onProgress })
                .then(data => {
                    if (typeof onSuccess === "function") {
                        let newData = { ...data };
                        newData.url =
                            ossSetting.Bucket.hostUrl + "/" + targetName;
                        onSuccess(newData);
                    }
                })
                .catch(error => {
                    if (typeof onFailure === "function") {
                        onFailure(error);
                    }
                });
        });
    } catch (e) {
        if (typeof onFailure === "function") {
            onFailure(e);
        }
    }
}
export function generateUUID() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
    ) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
/**
 * Get the DPR of screen
 */
export function getDPR() {
    var dpr;
    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    } else {
        dpr = 1;
    }
    return dpr;
}
/**
 * Screen ViewPort
 */
export function getViewPort() {
    var w = parseInt(window.innerWidth);
    var h = parseInt(window.innerHeight);
    var rw = w * getDPR();
    var rh = h * getDPR();
    var dpr = getDPR();
    var s = {
        width: w,
        height: h,
        realWidth: rw,
        realHeight: rh,
        dpr: dpr
    };
    return s;
}
/**
 * Parse a URL
 * @param {*} url
 */
export function parseURL(url) {
    var a = document.createElement("a");
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(":", ""),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, "").split("&"),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split("=");
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
        hash: a.hash.replace("#", ""),
        path: a.pathname.replace(/^([^\/])/, "/$1"),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
        segments: a.pathname.replace(/^\//, "").split("/")
    };
}
/**
 * 取得缩略图
 * @param {*} imgurl
 * @param {*} width
 * @param {*} height
 * @param {*} m
 */
export function getThumbUrl(option = {}) {
    let { imgurl, width, height, m } = option;
    if (!imgurl || typeof imgurl === "undefined") {
        return imageNotAvailable;
    }
    if (!/(.*)\.(png|gif|jpg|jpeg)$/i.test(imgurl)) {
        return imgurl;
    }
    if (typeof m === "undefined") {
        m = "";
    }
    if (imgurl.indexOf("x-oss-process=image/resize") != -1) {
        return imgurl;
    }
    var w = getViewPort().dpr * width;
    var h = getViewPort().dpr * height;
    w = parseInt(width, 10);
    h = parseInt(height, 10);
    w = w > 4096 ? 4096 : w;
    h = h > 4096 ? 4096 : h;
    w = w < 1 ? 1 : h;
    h = h < 1 ? 1 : h;

    var urlInfo = parseURL(imgurl);
    var isAliyun = false;
    if (urlInfo["host"] != undefined) {
        //判断是否阿里云，不是的话，采用服务端的缩放程序
        if (urlInfo["host"].toLowerCase().indexOf("aliyuncs.com") != -1) {
            isAliyun = true;
        }
        if (isAliyun) {
            var appendFillMode = "";
            if (
                m == "lfit" ||
                m == "mfit" ||
                m == "fill" ||
                m == "pad" ||
                m == "fixed"
            ) {
                appendFillMode = ",m_" + m;
            }
            return (
                imgurl +
                "?x-oss-process=image/resize,w_" +
                w +
                ",h_" +
                h +
                appendFillMode
            );
        } else {
            //如果服务端压力大，可以改为直接返回imgurl
            //console.log('THUMB:',Config.thumbUrl + '?src='+encodeURIComponent(imgurl)+'&w='+retinaWidth+'&h='+retinaHeight);
            //return '/thumb.php?src='+encodeURIComponent(imgurl)+'&w='+w+'&h='+h;
            //TODO:服务端缩略待设计
            return imgurl;
        }
    } else {
        return imgurl;
    }
}
/**
 * 将一个地区对象转为地区数组
 * @param {*} regionObject  {countryId:?,provinceId:?,cityId:?,countyId:?,townId:?}
 */
export function regionObjectToArray(regionObject) {
    let regions = [];
    if (regionObject.countryId !== 0) {
        regions.push(990000);
        regions.push(regionObject.countryId);
    } else {
        regions.push(regionObject.provinceId);
        if (regionObject.cityId > 0) {
            regions.push(regionObject.cityId);
            if (regionObject.countyId > 0) {
                regions.push(regionObject.countyId);
                if (regionObject.townId > 0) {
                    regions.push(regionObject.townId);
                }
            }
        }
    }
    return regions;
}
/**
 * 将一个地区数组转为地区对象
 * @param {*} regionArray 中国的[省、市、区县、街道或镇]或海外的[990000,国家]
 */
export function regionArrayToObject(regionArray) {
    let data = {
        countryId: 0,
        provinceId: 0,
        cityId: 0,
        countyId: 0,
        townId: 0
    };
    if (Array.isArray(regionArray) && regionArray.length > 0) {
        if (regionArray[0] !== 990000) {
            data.countryId = 0;
            data.provinceId = regionArray[0];
            if (regionArray.length > 1) {
                data.cityId = regionArray[1];
            }
            if (regionArray.length > 2) {
                data.countyId = regionArray[2];
            }
            if (regionArray.length > 3) {
                data.townId = regionArray[3];
            }
        } else {
            data.countryId = regionArray[1];
        }
    }
    return data;
}
/**
 * 生成数字随机数
 * @param {*} minNum 
 * @param {*} maxNum 
 */
export function getRandNumber(minNum = 1, maxNum = 10) {
    return Math.floor(Math.random() * maxNum + minNum);
}
/**
 * 读取APP的id和name
 * 从param中读取信息，检查sessionStorage，param有就以param的为主，否则从sessionStorage读取
 * @param {*} param 
 */
export function getCachedApp(param) {
    if (param != undefined && param.appName != undefined && param.appId != undefined) {
        const app = {
            id: param.appId,
            name: param.appName
        };
        sessionStorage.setItem('CURRENT_APP', JSON.stringify(app));
        return app;
    } else {

        const currentApp = sessionStorage.getItem('CURRENT_APP');
        try {
            const cachedApp = JSON.parse(currentApp);
            if (cachedApp.id && cachedApp.name) {
                return cachedApp;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}

/**
 * 
 */
export function getGlobalSetting(key) {
    const settingString = localStorage.getItem('setting');
    let setting = {};
    try {
        setting = JSON.parse(settingString);
    } catch {
    }
    if (!setting) {
        setting = {
            pageSize: 10
        }
    }
    if (setting[key]) {
        return setting[key]
    } else {
        return null;
    }
};
export function setGlobalSetting(payload) {
    const settingString = localStorage.getItem('setting');
    let setting = {};
    try {
        setting = JSON.parse(settingString);
    } catch {
    }
    if (!setting) {
        setting = {
            pageSize: 10
        }
    }
    const newData = {
        ...setting,
        ...payload
    };
    localStorage.setItem('setting', JSON.stringify(newData));
}
/**
 * 获取intl对象
 */
export function getIntl() {
    const cache = createIntlCache();
    let messages = {};
    const lang = getLocale();
    switch (lang) {
        case 'en-US':
            messages = enUS;
            break;
        case 'zh-CN':
        default:
            messages = zhCN;
    }
    const intl = createIntl(
        {
            locale: getLocale(),
            messages: messages,
        },
        cache,
    );
    return intl;
}
export function clearCacheData(prefix, isLocalStorage = true) {
    const storage = isLocalStorage ? localStorage : sessionStorage;
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key === prefix) {
            storage.removeItem(key);
        } else if (/^prefix/.test(key)) {
            storage.removeItem(key);
        }
    }
}
/**
 * 获取设定
 */
export function getCacheData(key, isLocalStorage = true) {
    const storage = isLocalStorage ? localStorage : sessionStorage;
    const settingString = storage.getItem(key);
    let setting = null;
    try {
        const now = parseInt(new Date().getTime() / 1000); //eslint-disable-line no-magic-numbers
        setting = JSON.parse(settingString);
        if (!setting || !setting.expired || setting.expired < now) {
            setting = null;
        } else if (setting.type) {

            switch (setting.type) {
                case 'boolean':
                case 'object':
                case 'number':
                case 'string':
                default:
                    return setting.content;
            }
        }
    } catch { }
    return null;
}
/**
 * 保存全局设定
 * @param {} payload
 */
export function setCacheData(key, value, config = {}) {
    const defaultConfig = {
        isLocalStorage: true,
        lifetime: 1200
    }
    const option = Object.assign({}, defaultConfig, config);
    console.log('option', option);
    const storage = option.isLocalStorage ? localStorage : sessionStorage;
    if (value === null) {
        storage.removeItem(key);
        return;
    }
    const now = parseInt(new Date().getTime() / 1000); //eslint-disable-line no-magic-numbers
    const data = {
        content: '',
        type: 'string',
        expired: now + option.lifetime
    };

    if (typeof value === 'string') {
        data.content = value;
        data.type = 'string';
    } else if (typeof value === 'object') {
        data.content = value;
        data.type = 'object';
    } else if (typeof value === 'number') {
        data.type = 'number';
        data.content = value;
    } else if (typeof value === 'boolean') {
        data.type = 'boolean';
        data.content = value;
    }
    storage.setItem(key, JSON.stringify(data));
}