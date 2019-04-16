/**
 * 用户类目API请求
 */
import request from '../utils/request';
import APILIST from '../apiList';


/**
 * 查询当前用户信息
 * @returns {{uid, accessToken, username}}
 */
export function queryCurrent() {
  return {
    uid: sessionStorage.getItem('console.uid'),
    accessToken: sessionStorage.getItem('console.accessToken'),
    username: sessionStorage.getItem('console.username'),
    realname: sessionStorage.getItem('console.realname'),
    mobile: sessionStorage.getItem('console.mobile'),
    gender: sessionStorage.getItem('console.gender'),
    menuList: JSON.parse(sessionStorage.getItem('console.menuList')),
  };
  //return request('/api/currentUser');
}

/**
 * 查询用户列表
 * @param params  {page: 1, limit: 10}
 * @returns {Object}
 */
export function queryUsers(params) {
  const defaultParam = {page: 1, limit: 10};

  return request(APILIST.BACKEND.USER_LIST, {
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
  console.log(APILIST.BACKEND.USER_LOGIN,params);
  return request(APILIST.BACKEND.USER_LOGIN, {
    method: 'POST',
    body: params,
  });
}

/**
 * 创建管理人员
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createUser(params){
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
export async function updateUser(params){
  return request(APILIST.BACKEND.USER_UPDATE,{
    'method':'POST',
    body:params
  });
}

/**
 * 删除用户
 * @param params
 * @returns {Promise.<Object>}
 */
export async function deleteUser(params){
  return request(APILIST.BACKEND.USER_DELETE,{
    'method':'POST',
    body:params
  });
}
/**
 * 改密码
 * @param {*} params 
 */
export async function changePasswd(params){
  return request(APILIST.BACKEND.USER_CHANGE_PASSWD,{
    method:'POST',
    body:params
  })
}