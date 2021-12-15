/**
 * 用户类目API请求
 */
import request from '../utils/request';
import APILIST from '../apiList';
import { getUserProfile } from '../utils/auth';

/**
 * 查询当前用户信息
 * @returns {{uid, accessToken, username}}
 */
export function queryCurrent() {
  return getUserProfile();
}

/**
 * 查询指定应用的用户列表
 * @param params  {page: 1, limit: 10}
 * @returns {Object}
 */
export function queryUsers(params) {
  const defaultParam = { page: 1, limit: 10 };

  return request(APILIST.BACKEND.USER_LIST, {
    'method': 'POST',
    body: {
      ...defaultParam,
      ...params
    }
  });
}


/**
 * 查询用户列表
 * @param params  {page: 1, limit: 10}
 * @returns {Object}
 */
export function queryAllUsers(params) {
  const defaultParam = { page: 1, limit: 10 };

  return request(APILIST.BACKEND.USER_ALL_LIST, {
    'method': 'POST',
    body: {
      ...defaultParam,
      ...params
    }
  });
}

/**
 * 管理人员登陆
 * @param params
 * @returns {Promise.<Object>}
 */
export async function userLogin(params) {
  console.log(APILIST.BACKEND.USER_LOGIN, params);
  return request(APILIST.BACKEND.USER_LOGIN, {
    method: 'POST',
    body: params,
  });
}

export async function userLoginByCode(params) {
  return request(APILIST.BACKEND.USER_LOGIN_BYCODE, {
    method: 'POST',
    body: params,
  });
}

/**
 * 刷新AccessToken
 */
export async function refreshAccessToken(params) {
  return request(APILIST.BACKEND.USER_REFRESH_TOKEN, {
    method: 'POST',
    body: params,
  });
}
/**
 * 创建管理人员
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createUser(params) {
  return request(APILIST.BACKEND.USER_CREATE, {
    method: 'POST',
    body: params,
  });
}

/**
 * 修改人员资料
 * @param params
 * @returns {Promise.<Object>}
 */
export async function updateUser(params) {
  return request(APILIST.BACKEND.USER_UPDATE, {
    'method': 'POST',
    body: params
  });
}

/**
 * 删除用户
 * @param params
 * @returns {Promise.<Object>}
 */
export async function deleteUser(params) {
  return request(APILIST.BACKEND.USER_DELETE, {
    'method': 'POST',
    body: params
  });
}
/**
 * 改密码
 * @param {*} params 
 */
export async function changePasswd(params) {
  return request(APILIST.BACKEND.USER_CHANGE_PASSWD, {
    method: 'POST',
    body: params
  })
}
export async function bindLogin(params) {
  return request(APILIST.BACKEND.USER_BIND_LOGIN, {
    method: 'POST',
    body: params
  })
}