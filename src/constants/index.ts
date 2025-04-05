
export const PUBLIC_PATH = '/';



export const SYS_CONFIG = {
    //项目的APP_KEY，用于访问ACC的appId，需要和后端的一致
    appKey: 1000,
    //是否使用md5加密密码
    passwordHashByMd5: true,
    //语种，系统会向后端传递此参数，后端根据此参数返回对应的语言处理反馈
    lang: 'zh_CN',
    //是否是单应用模式
    ssa: false
}
export const DEFAULT_USERINFO: Kuga.UserInfo = {
    uid: 0,
    username: '',
    refreshToken: '',
    refreshTokenExpiredIn: 0,
    accessToken: '',
    accessTokenExpiredIn: 0,
    fullname: '',
    avatar: '',
    name: '',
    menuList: [],
};

export const THEME_SOLUTIOIN = {
    token: {
        colorPrimary: '#b218ff',
        borderRadius: 0,
    },
};
export const DEFAULT_AVATAR = '/static/logo.svg';

export const DICT = {
    ROLE_ASSIGN_POLICY: [
        {
            value: 0,
            label: '不自动分配'
        },
        {
            value: 1,
            label: '自动分配给登陆的会员'
        },
        {
            value: 2,
            label: '未登录分配'
        }
    ],
    ROLE_TYPES: [
        {
            value: 1,
            label: '普通角色'
        },
        {
            value: 0,
            label: '超级管理员'
        }
    ]
}
export const API_CONFIG = {
    API_HOST: process.env.API_HOST+'/v4/gateway',
};

