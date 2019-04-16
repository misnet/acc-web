/**
 *
 * @author Donny
 * @copyright 2017
 */
import md5 from 'md5';
import request from './request';
import APILIST from '../apiList';
function checkAuth(identity, menus) {
  console.log('identity',identity,menus)
  if (!menus || menus.length <= 0) { return false; }
  let result = false;
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (identity === menu.identity) { return true; }
    if (menu.children && menu.children.length) {
      result = checkAuth(identity, menu.children);
      if (result) { return true; }
    }
  }

  return false;
}

export function getAuthority() {
  return sessionStorage.getItem('console.uid');
}
/**
 * 判断用户是否有权限
 */
export function hasPermission(authorityIdentity) {
  // 通用页面直接允许通过
  if (authorityIdentity === 'common') { return true; }

  let uid = getAuthority();
  uid = parseInt(uid,10);

  if (!authorityIdentity || !uid) { return false; }

  const rootIdentity = 'root';
  // 已登录且是首页
  if (authorityIdentity === rootIdentity && uid) {
    return true;
  }

  //if (!store) { return false; }

  // 从redux中获取菜单
  // var menus = store.getState().global.menus;
  // if (!menus || menus.length <= 0) {
  //   return false;
  // }
  const {menuList} = getUserProfile()
  return checkAuth(authorityIdentity, menuList);
}
/**
 * 保存用户资料到缓存
 * @param {*} payload
 */
export function setAuthority(payload){
  if(sessionStorage){
    for(let key in payload){
      if(key=='password'||key=='repassword'){
        continue;
      }
      if(key!='menuList'){
        sessionStorage.setItem('console.'+key,payload[key]);
      }else{
        let menu = '';
        try {
          menu = JSON.stringify(payload[key]);
        } catch (e) {
        }
        sessionStorage.setItem('console.'+key,menu);
      }
    }
  }
}

/**
 * 取用户资料
 */
export function getUserProfile(){
  let data = {
    uid:0,
    username:'',
    accessToken:false,
    menuList:[],
    realname:'',
    mobile:'',
    gender:0
  };
  if(sessionStorage){
    data.uid = sessionStorage.getItem('console.uid');
    data.username = sessionStorage.getItem('console.username');
    data.accessToken = sessionStorage.getItem('console.accessToken');
    data.realname = sessionStorage.getItem('console.realname');
    data.mobile = sessionStorage.getItem('console.mobile');
    data.gender = sessionStorage.getItem('console.gender');
    let menu = [];
    if(data.realname==null){
      data.realname = '';
    }

    if(data.mobile==null){
      data.mobile = '';
    }
    data.gender = parseInt(data.gender);
    try {
      menu = JSON.parse(sessionStorage.getItem('console.menuList'));
    } catch (e) {
    }
    data.menuList = menu;
  }
  return data;
}
/**
 * 清理缓存的数据
 */
export function clearUserProfile(){
  sessionStorage.clear();
}
/**
 * 更新用户资料到服务端
 * @param {*} payload
 */
export function updateUserProfile(payload){
  let params = Object.assign({},payload);
  if(params.password){
    params.password = md5(params.password);
  }
  if(params.repassword){
    params.repassword = md5(params.repassword);
  }
  return request(APILIST.BACKEND.USER_UPDATE_PROFILE,{
    'method':'POST',
    body:params
  });
}

