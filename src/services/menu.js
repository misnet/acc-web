/**
 * 菜单管理
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 查询菜单列表
 * @returns {Object}
 */
export function menuList(params) {
    return request(APILIST.BACKEND.MENU_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 修改菜单
 * @param params
 * @returns {Promise.<Object>}
 */
export async function updateMenu(params) {
    return request(APILIST.BACKEND.MENU_UPDATE, {
        method: 'POST',
        body: params,
    });
}
/**
 * 创建菜单
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createMenu(params) {
    return request(APILIST.BACKEND.MENU_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除菜单
 * @param params
 * @returns {Promise.<Object>}
 */
export async function deleteMenu(params) {
    return request(APILIST.BACKEND.MENU_DELETE, {
        method: 'POST',
        body: params,
    });
}
