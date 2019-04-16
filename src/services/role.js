/**
 * 角色管理相关请求处理API
 * @author Donny
 *
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 列出所有操作集
 * @param params
 * @returns {Promise.<Object>}
 */
export async function listOperationList(params) {
    return request(APILIST.BACKEND.RESOURCE_OPS, {
        method: 'POST',
        body: params,
    });
}
/**
 * 列出权限资源组
 * @param params
 * @returns {Promise.<void>}
 */
export async function listResourceGroup(params) {
    return request(APILIST.BACKEND.RESOURCE_GROUP, {
        method: 'POST',
        body: params,
    });
}
/**
 * 给角色分配菜单
 * @param params
 * @returns {Promise.<Object>}
 */
export async function assignMenu(params) {
    return request(APILIST.BACKEND.ROLE_ASSIGNMENU, {
        method: 'POST',
        body: params,
    });
}
/**
 * 角色分配给用户
 * @param params
 * @returns {Promise.<Object>}
 */
export async function assignUser(params) {
    return request(APILIST.BACKEND.ROLE_ASSIGNUSER, {
        method: 'POST',
        body: params,
    });
}

export async function unassignUser(params) {
    return request(APILIST.BACKEND.ROLE_UNASSIGNUSER, {
        method: 'POST',
        body: params,
    });
}
/**
 * 列出指定角色的用户列表
 * @param params {id:Integer}
 * @returns {Promise.<Object>}
 */
export async function listUser(params) {
    return request(APILIST.BACKEND.ROLE_LISTUSER, {
        method: 'POST',
        body: params,
    });
}
/**
 * 查询角色列表
 * @returns {Object}
 */
export async function list(params) {
    return request(APILIST.BACKEND.ROLE_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 修改角色
 * @param params
 * @returns {Promise.<Object>}
 */
export async function update(params) {
    return request(APILIST.BACKEND.ROLE_UPDATE, {
        method: 'POST',
        body: params,
    });
}
/**
 * 创建角色
 * @param params
 * @returns {Promise.<Object>}
 */
export async function create(params) {
    return request(APILIST.BACKEND.ROLE_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除角色
 * @param params
 * @returns {Promise.<Object>}
 */
export async function remove(params) {
    return request(APILIST.BACKEND.ROLE_DELETE, {
        method: 'POST',
        body: params,
    });
}
