import { notification } from 'antd';
import { mapKeys, isBoolean } from 'lodash';
import md5 from 'md5';
import systemConfig from '../config';
import { getUserProfile } from './auth';
import { sortKeysBy } from './utils';
import { history } from 'umi';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
function parseJSON(response) {
    return response.json();
}
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
    const apiConfig = systemConfig.getOption();
    const currentUserInfo = getUserProfile();
    const access_token = currentUserInfo.accessToken;


    const defaultOptions = {
        //credentials: 'include',
        mode: 'no-cors',
    };
    const origin = `${apiConfig.gateway.split('//')[0]}//${apiConfig.gateway.split('//')[1].split('/')[0]}`;
    let newOptions = { ...defaultOptions, ...options };
    if (window.location.origin != origin) {
        newOptions['mode'] = 'cors';
    }
    newOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
    };
    if (!newOptions.body) {
        newOptions.body = {};
    }
    newOptions.body['appkey'] = apiConfig.appKey;
    newOptions.body['method'] = url;
    newOptions.body['access_token'] = access_token;

    newOptions.body = sortKeysBy(newOptions.body);

    let sign = apiConfig.appSecret;
    let newParams = {};
    //newOptions.body中有些项的值是null或undefined，这些项对服务端是无用的，要过滤掉，否则可能引起签名失败
    mapKeys(newOptions.body, function (value, key) {
        if (value != undefined) {
            var t = value == null ? '' : value;
            if (isBoolean(t)) {
                t = t ? 1 : '';
            } else if (Array.isArray(t) || (typeof t == 'object' && t !== null)) {
                t = JSON.stringify(t);
            } else if (t === null) {
                t = '';
            }
            sign += key + t;
            newParams[key] = value;
        }
    });
    newParams['sign'] = sign + apiConfig.appSecret;
    newParams['sign'] = md5(newParams['sign']).toUpperCase();
    newOptions.body = JSON.stringify(newParams);

    return fetch(apiConfig.gateway + '/' + url, newOptions)
        .then(checkStatus).then(parseJSON)
        .then(resp => {
            switch (resp.status) {
                case 99000:
                    history.push('/500');
                    break;
                case 99004:
                    //accessToken无效了
                    window.g_app._store.dispatch({
                        type: 'login/refreshToken',
                        payload: {
                            refreshToken: sessionStorage.getItem('console.refreshToken')
                        }
                    });

                    notification.error({
                        message: '警告提示',
                        description: '登陆状态失效，正重新刷新，如页面不正常，请刷新一下',
                    });
                    break;
                case 99006:
                    //刷新token无效了
                    window.g_app._store.dispatch({
                        type: 'login/logout'
                    });
                    break;
                default:
                    if (resp.status > 0) {
                        notification.error({
                            message: '错误提示',
                            description: resp.message,
                        });
                        if (resp.debug) {
                            console.log(resp.debug);
                        }
                    }
            }

            return resp;

        }).catch((error) => {
            // const { dispatch } = store;
            // const status = e.name;
            // if (status === 401) {
            //   dispatch({
            //     type: 'login/logout',
            //   });
            //   return;
            // }
            // if (status === 403) {
            //   dispatch(routerRedux.push('/exception/403'));
            //   return;
            // }
            // if (status <= 504 && status >= 500) {
            //   dispatch(routerRedux.push('/exception/500'));
            //   return;
            // }
            // if (status >= 404 && status < 422) {
            //   dispatch(routerRedux.push('/exception/404'));
            // }
            if (error.code) {
                notification.error({
                    message: error.name,
                    description: error.message,
                });
            } else {
                notification.error({
                    message: '网络异常',
                    description: '我非圣贤，孰能无过！喝杯茶再刷新重试！',
                });
            }
            throw error;
        });
}
