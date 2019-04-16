/**
 *
 * @author Donny
 * @copyright 2017
 */

import request from './request';
import APILIST from '../apiList';
import md5 from 'md5';


/**
 * 判断用户是否登录了
 */
export function hasAuthority() {
  return sessionStorage.getItem('console.uid')||false;
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
