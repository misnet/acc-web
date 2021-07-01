/**
 *
 * @author Donny
 * @copyright 2017
 */

import request from './request';
import APILIST from '../apiList';
import md5 from 'md5';
import { getCacheData, setCacheData, clearCacheData } from './utils';

/**
 * 判断用户是否登录了
 */
export function hasAuthority() {
    console.log('uid', getCacheData('console.uid', true));
    return getCacheData('console.uid', true) || false;
    //return sessionStorage.getItem('console.uid') || false;
}
/**
 * 保存用户资料到缓存
 * @param {*} payload
 */
export function setAuthority(payload) {
    console.log('setAuthority', payload)
    for (let key in payload) {
        if (key == 'password' || key == 'repassword') {
            continue;
        }
        if (key != 'menuList') {
            setCacheData('console.' + key, payload[key], {
                isLocalStorage: true,
                lifetime: 3600
            });
            //sessionStorage.setItem('console.' + key, payload[key]);
        } else {
            let menu = '';
            try {
                menu = JSON.stringify(payload[key]);
            } catch (e) {
            }
            setCacheData('console.' + key, menu, {
                isLocalStorage: true,
                lifetime: 3600
            });
            //sessionStorage.setItem('console.' + key, menu);
        }
    }
}

/**
 * 取用户资料
 */
export function getUserProfile() {
    let data = {
        uid: 0,
        username: '',
        accessToken: false,
        menuList: [],
        realname: '',
        mobile: '',
        gender: 0
    };
    data.uid = getCacheData('console.uid');
    data.username = getCacheData('console.username');
    data.accessToken = getCacheData('console.accessToken');
    data.realname = getCacheData('console.realname');
    data.mobile = getCacheData('console.mobile');
    data.gender = getCacheData('console.gender');
    let menu = [];
    if (data.realname == null) {
        data.realname = '';
    }

    if (data.mobile == null) {
        data.mobile = '';
    }
    data.gender = parseInt(data.gender);
    try {
        menu = JSON.parse(getCacheData('console.menuList'));
    } catch (e) {
    }
    data.menuList = menu;
    return data;
}
/**
 * 清理缓存的数据
 */
export function clearUserProfile() {
    clearCacheData('console.*');
}
/**
 * 更新用户资料到服务端
 * @param {*} payload
 */
export function updateUserProfile(payload) {
    let params = Object.assign({}, payload);
    if (params.password) {
        params.password = md5(params.password);
    }
    if (params.repassword) {
        params.repassword = md5(params.repassword);
    }
    return request(APILIST.BACKEND.USER_UPDATE_PROFILE, {
        'method': 'POST',
        body: params
    });
}
function checkAuth(identity, menus) {
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


/**
 * 判断用户是否有权限
 */
export function hasPermission(authorityIdentity) {
    // 通用页面直接允许通过
    if (authorityIdentity === 'common') { return true; }

    let uid = hasAuthority();
    if (!uid) { return false; }
    uid = parseInt(uid, 10);

    if (!authorityIdentity || !uid) { return false; }

    const rootIdentity = 'root';
    // 已登录且是首页
    if (authorityIdentity === rootIdentity && uid) {
        return true;
    }
    const { menuList } = getUserProfile()
    return checkAuth(authorityIdentity, menuList);
}