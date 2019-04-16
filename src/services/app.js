/**
 * APP管理
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 查询APP列表
 * @returns {Object}
 */
export function appList(params) {
    return request(APILIST.BACKEND.APP_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 修改APP
 * @param params
 * @returns {Promise.<Object>}
 */
export async function updateApp(params) {
    return request(APILIST.BACKEND.APP_UPDATE, {
        method: 'POST',
        body: params,
    });
}
/**
 * 创建APP
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createApp(params) {
    return request(APILIST.BACKEND.APP_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除APP
 * @param params
 * @returns {Promise.<Object>}
 */
export async function deleteApp(params) {
    return request(APILIST.BACKEND.APP_DELETE, {
        method: 'POST',
        body: params,
    });
}
