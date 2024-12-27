import { indexOf } from 'lodash';
import queryString from 'query-string';
import { request } from 'umi';
import dayjs from 'dayjs';

import { API_CONFIG } from '@/constants/index';

import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import Hmacsha256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

type urlKey = Record<string, string>;

export async function apiRequest(apiMethod: string, payload: any, method: string = 'POST') {
    return request(`${API_CONFIG.API_HOST}/${apiMethod}`, {
        method,
        data: payload
    });
}

export function getFileSize(value: number, fixed: number = 2) {
    if (null === value || value === '') {
        return '0 Bytes';
    }
    const unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
    let index = 0;
    const srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    const size = srcsize / Math.pow(1024, index);
    return size.toFixed(fixed) + unitArr[index];
}
/**
 * num四舍五入，保留x位小数
 * @param {*} num
 * @param {*} x
 */
export function roundNumber(num: number, x = 2): number {
    const len: number = Math.max(0, x);
    const t: number = num * Math.pow(10, len + 1);
    const d = parseInt(t.toString()) / 10;
    const result: number = Math.round(d) / Math.pow(10, len);
    if (isNaN(result)) {
        return 0;
    } else {
        return result;
    }
}
/**
 * UUID值
 */
export function generateUUID() {
    const s = 16;
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * s) % s | 0;
        d = Math.floor(d / s);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(s);
    });
    return uuid;
}
/**
 * Parse a URL
 * @param {*} url
 */
export function parseURL(url: string): urlKey {
    type stringKey = Record<string, RegExp>;
    const patternUrl: stringKey = {
        protocol: /^(.+)\:\/\//,
        host: /\:\/\/(.+?)[\?\#\s\/]/,
        path: /\w(\/.*?)[\?\#\s]/,
        query: /\?(.+?)[\#\/\s]/,
        hash: /\#(\w+)\s$/,
    };

    function formatQuery(str: string): string {
        return str.split('&').reduce((a: any, b: string) => {
            const arr = b.split('=');
            a[arr[0]] = arr[1];
            return a;
        }, {});
    }
    const urlObj: urlKey = {
        protocol: '',
        host: '',
        path: '',
        query: '',
        hash: '',
    };
    for (const key in patternUrl) {
        const pattern: RegExp = patternUrl[key];
        const r: any = pattern.exec(url);
        urlObj[key] = key === 'query' ? <string>r && formatQuery(r[1]) : r && <string>r[1];
    }
    return urlObj;
}
/**
 * Get the DPR of screen
 */
export function getDPR(): number {
    let dpr;
    if (typeof window !== 'undefined' && typeof window['devicePixelRatio'] !== 'undefined') {
        dpr = window['devicePixelRatio'];
    } else {
        dpr = 1;
    }
    return dpr;
}
type thumbOption = {
    src: string;
    width?: number;
    height?: number;
    policy?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
};
/**
 * 取得缩略图
 * @param {*} src
 * @param {*} width
 * @param {*} height
 * @param {*} policy
 */
export function getThumbUrl(option: thumbOption): string {
    const { src, width, height, policy = '' } = option;
    if (!src || typeof src === 'undefined' || src === '') {
        return '/img/image_error.png';
    }
    //console.log('getDPR()', getDPR());
    let w: number = width ? getDPR() * width : 0;
    let h: number = height ? getDPR() * height : 0;
    w = parseInt(w.toString());
    h = parseInt(h.toString());
    const widthFourK = 4096;
    w = w > widthFourK ? widthFourK : w;
    h = h > widthFourK ? widthFourK : h;
    w = w < 1 ? 0 : w;
    h = h < 1 ? 0 : h;

    const urlInfo = parseURL(src);
    let isAliyun = false;
    const queryInfo = queryString.parseUrl(src);
    if (urlInfo['host'] !== undefined) {
        //判断是否阿里云，不是的话，采用服务端的缩放程序
        const validHost = ['aliyuncs.com', 'pod.kity.me'];
        validHost.forEach((host) => {
            if (urlInfo['host'].toLowerCase().indexOf(host) !== -1) {
                isAliyun = true;
                return false;
            }
        });
        if (isAliyun) {
            let m = policy;
            let appendFillMode = '';
            const subfix = ['image/resize'];
            if (w > 0) {
                subfix.push('w_' + w);
            }
            if (h > 0) {
                subfix.push('h_' + h);
            }
            if (m === 'lfit' || m === 'mfit' || m === 'fill' || m === 'pad' || m === 'fixed') {
                appendFillMode = 'm_' + m;
                subfix.push(appendFillMode);
            }
            return queryString.stringifyUrl({
                url: src,
                query: { ['x-oss-process']: subfix.join(',') },
            });
        } else if (urlInfo['host'].indexOf('uploads.yinshida.com.cn') !== -1) {
            let nw = width;
            let nh = height;
            if (!width || width <= 0) {
                nw = height;
            }
            if (!height || height <= 0) {
                nh = width;
            }
            if (nw == 0 || nh == 0) {
                nw = 100;
                nh = 100;
            }
            return queryString.stringifyUrl({
                url: src,
                query: { dimensions: nw + 'x' + nh },
            });
        } else {
            return src;
        }
    } else {
        return src;
    }
}
/**
 * 清掉过期数据
 */
export async function clearExpiredCacheData(storage: Storage) {
    const remainKeys = ['shortcuts', 'userInfo', 'uds_token'];
    const t: number = new Date().getTime() / 1000;
    const now = parseInt(t.toString()); //eslint-disable-line no-magic-numbers
    for (let i = 0; i < storage.length; i++) {
        const key: any = storage.key(i);
        if (indexOf(remainKeys, key) === -1) {
            const content: any = storage.getItem(key);
            let obj: any = {};
            try {
                obj = JSON.parse(content);
            } catch (e) {
                obj = {};
            }
            if (obj && obj.expired && obj.expired < now) {
                storage.removeItem(key);
            }
        }
    }
}

function removeCacheData(option: { id: string; type?: string }) {
    const storage = option.type === 'session' ? sessionStorage : localStorage;
    storage.removeItem(option.id);
}

/**
 * 保存设定
 * @param string key
 * @param any value
 * @param {type,lifetime} option
 */
export function setCacheData(key: string, value: any, option: { type: string; lifetime?: number }) {
    const storage = option.type !== 'session' ? localStorage : sessionStorage;
    if (value === null) {
        storage.removeItem(key);
        return;
    }
    const t: number = new Date().getTime() / 1000;
    const now = parseInt(t.toString()); //eslint-disable-line no-magic-numbers
    const lifetime = option.lifetime ? option.lifetime : 3600; //eslint-disable-line no-magic-numbers
    const data = {
        data: value,
        expired: now + lifetime,
    };
    storage.setItem(key, JSON.stringify(data));
}
/**
 *
 * @param key
 * @param option
 * @returns
 */
export function getCacheData(key: string, option: { type: string }) {
    const storage = option.type !== 'session' ? localStorage : sessionStorage;
    const content: string | null = storage.getItem(key);
    const t: number = new Date().getTime() / 1000;
    const now = parseInt(t.toString()); //eslint-disable-line no-magic-numbers
    let obj: {
        expired?: number;
        data?: string;
    } = {};
    try {
        obj = content ? JSON.parse(content) : {};
    } catch (e) {
        obj = {};
    }

    if (!obj || !obj.expired || obj.expired < now) {
        removeCacheData({
            id: key,
            type: option.type,
        });
        return null;
    }
    if (obj.data) {
        return obj.data;
    } else {
        return null;
    }
}
/**
 * 得到缓存数据
 * @param {*} callback
 * @param {*} option
 */
export async function getCacheDataWithCallback(callback: Function, option: { type: string; id: string; lifetime?: number }) {
    const storage = option.type === 'session' ? sessionStorage : localStorage;
    const content: string | null = await storage.getItem(option.id);
    const t: number = new Date().getTime() / 1000;
    const now = parseInt(t.toString()); //eslint-disable-line no-magic-numbers
    let refresh = false;
    let obj: {
        expired?: number;
        data?: string;
    } = {};
    //5次访问随机1次清过期缓存
    if (now % 5 === 0) {
        clearExpiredCacheData(storage);
    }
    try {
        obj = content ? JSON.parse(content) : {};
    } catch (e) {
        obj = {};
    }
    //console.log(obj.data.ValidTo, moment(obj.data.ValidTo).unix());
    if (!obj || !obj.expired || obj.expired < now) {
        console.log('清缓存');
        removeCacheData(option);
        refresh = true;
    }
    if (!refresh && obj.data) {
        return obj.data;
    } else if (typeof callback === 'function') {
        const result = await callback();
        setCacheData(option.id, result, option);
        return result;
    }
}
export function ossUploadSetting(option: any) {
    const { ossSetting } = option;
    const ossDate = dayjs().toISOString().replace(/[-:]/g, '').replace(/\..*$/, '') + 'Z';
    if (!ossSetting) {
        return null;
    }
    const policy = {
        expiration: ossSetting?.Credentials?.Expiration.replace('Z', '.000Z'),
        conditions: [
            { "bucket": ossSetting?.Bucket?.name },
            { "x-oss-date": ossDate },
            { 'x-oss-security-token': ossSetting?.Credentials?.SecurityToken },
            { "x-oss-signature-version": 'OSS4-HMAC-SHA256' },
            { 'x-oss-credential': ossSetting?.Credentials?.AccessKeyId + '/' + ossDate.split('T')[0] + '/' + ossSetting?.Bucket?.region + '/oss/aliyun_v4_request' },
            ["content-length-range", 1, 1024 * 1024 * 1024 * 100]
        ],
    };
    const encodedPolicy = Base64.stringify(Utf8.parse(JSON.stringify(policy)));

    const dataKey = Hmacsha256(ossDate.split('T')[0], "aliyun_v4" + ossSetting?.Credentials?.AccessKeySecret);
    const dateRegioinKey = Hmacsha256(ossSetting?.Bucket?.region, dataKey);
    const dateRegionServiceKey = Hmacsha256('oss', dateRegioinKey);
    const signingKey = Hmacsha256('aliyun_v4_request', dateRegionServiceKey);
    const signature = Hmacsha256(encodedPolicy, signingKey).toString(Hex);


    return {
        // policy: encodedPolicy,
        // signature,
        // ossDate,
        hostUrl: ossSetting.Bucket.hostUrl,
        action: 'https://' + ossSetting?.Bucket?.name + '.' + ossSetting?.Bucket?.endpoint,
        extraData: {
            OSSAccessKeyId: ossSetting?.Credentials?.AccessKeyId,
            policy: encodedPolicy,
            'x-oss-date': ossDate,
            'x-oss-security-token': ossSetting?.Credentials?.SecurityToken,
            "x-oss-signature-version": 'OSS4-HMAC-SHA256',
            'x-oss-credential': ossSetting?.Credentials?.AccessKeyId + '/' + ossDate.split('T')[0] + '/' + ossSetting?.Bucket?.region + '/oss/aliyun_v4_request',
            'x-oss-signature': signature,
        }
    }

}

export function getLocalSetting(key: string, defaultValue: any = null) {
    const setting = getCacheData('gSetting', { type: 'local' });
    return setting ? setting[key] : defaultValue;
}
export function setLocalSetting(key: string, value: any) {
    let setting = getCacheData('gSetting', { type: 'local' });
    if (!setting) {
        setting = {};
    }
    setting[key] = value;
    setCacheData('gSetting', setting, { type: 'local' });
}

export function numberSum(num1: any, num2: any): number {
    const n1 = isNaN(parseFloat(num1)) ? 0 : parseFloat(num1);
    const n2 = isNaN(parseFloat(num2)) ? 0 : parseFloat(num2);
    return roundNumber(n1 + n2, 2);
}


export function copyTextToClipboard(text: string) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text).then(
            function () {
                return true;
            },
            function (err) {
                return false;
            },
        );
    } else {
        return false;
    }
}
export function nl2br(str: any) {
    const newlineRegex = /(\r\n|\r|\n)/g;
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(newlineRegex, '<br />');
}