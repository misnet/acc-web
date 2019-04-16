import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '../utils/Authorized';
import { userLogin } from '../services/user';
import {
    setAuthority,
    hasAuthority,
    clearUserProfile,
    getUserProfile,
    updateUserProfile,
} from '../utils/auth';

export default {
    namespace: 'login',

    state: {
        loginStatus: undefined,
        uid: undefined,
        username: '',
        accessToken: '',
        menuList: [],
        realname: '',
        mobile: '',
        gender: 0,
        type:'account'
    },

    effects: {
        *login({ payload }, { call, put }) {

            let response = { data: {} };
            //if (payload.type == 'account') {
                response = yield call(userLogin, payload);
            //}
            let data = {};
            if (typeof response['data']['uid'] != 'undefined') {
                data = response['data'];
                data.loginStatus = 'ok';
                data.type = payload.type;
            } else {
                data = {
                    type: payload.type,
                    uid: 0,
                    username: '',
                    menuList: [],
                    accessToken: '',
                    loginStatus: 'error',
                };
            }
            //缓存accessToken等
            yield put({
                type: 'changeLoginStatus',
                payload: data,
            });
            if (data.uid) {
                reloadAuthorized();
                yield put(routerRedux.push('/'));
            }
        },
        *logout(_, { put, select }) {
            try {
                // get location pathname
                const urlParams = new URL(window.location.href);
                const pathname = yield select(state => state.routing.location.pathname);
                // add the parameters in the url
                urlParams.searchParams.set('redirect', pathname);
                window.history.replaceState(null, 'login', urlParams.href);
                clearUserProfile();
            } finally {
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        status: false,
                        currentAuthority: 'guest',
                    },
                });
                reloadAuthorized();
                yield put(routerRedux.push('/user/login'));
            }
        },
    },

    reducers: {
        //登录完
        changeLoginStatus(state, { payload }) {
            // 将用户登录完的信息保存至本地缓存中
            setAuthority(payload);
            return {
                ...state,
                loginStatus: payload.loginStatus,
                uid: payload.uid,
                type: payload.type,
            };
        },
    },
};
