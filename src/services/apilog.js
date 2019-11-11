/**
 * APILOG管理
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 查询APP列表
 * @returns {Object}
 */
export function apiLogList(params) {
    return request(APILIST.BACKEND.APILOG_LIST, {
        method: 'POST',
        body: params,
    });
}