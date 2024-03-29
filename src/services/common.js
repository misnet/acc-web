/**
 * 系统相关API
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 查询OSSSetting
 * @returns {Object}
 */
export async function queryOssSetting(params) {
    return request(APILIST.COMMON.OSSETTING, {
        method: 'POST',
        body: params,
    });
}
/**
 * 地区列表
 * @param {} params 
 */
export async function regionList(params) {
    return request(APILIST.COMMON.REGION_LIST, {
        method: 'POST',
        body: params,
    });
}
export async function ipSearch(params) {
    return request(APILIST.COMMON.IP_SEARCH, {
        method: 'POST',
        body: params,
    });
}
export async function sendSms(params) {
    return request(APILIST.COMMON.SMS_SEND, {
        method: 'POST',
        body: params,
    });
}
