/**
 * API接口列表
 * @author Donny
 *
 */
export default {
    COMMON: {
        OSSETTING: 'common.osssetting',
        REGION_LIST: 'common.region.list',
        IP_SEARCH: 'common.ip',
        SMS_SEND: 'common.verifycode.send'
    },
    BACKEND: {
        // ACC查询
        APP_LIST: 'acc.app.list',
        APP_CREATE: 'acc.app.create',
        APP_UPDATE: 'acc.app.update',
        APP_DELETE: 'acc.app.delete',

        //刷新AccessToken
        USER_REFRESH_TOKEN: 'acc.user.refresh.token',
        USER_LOGIN_BYCODE: 'acc.user.login.bycode',
        // 用户登陆
        USER_LOGIN: 'acc.user.login',
        // 用户查询
        USER_LIST: 'acc.user.list',
        USER_ALL_LIST: 'acc.user.alllist',
        // 用户创建
        USER_CREATE: 'acc.user.create',
        // 用户更新
        USER_UPDATE: 'acc.user.update',
        // 用户删除
        USER_DELETE: 'acc.user.delete',
        // 给用户指定角色
        USER_ASSIGN_ROLES: 'acc.user.assignrole',
        USER_BIND_LOGIN: 'acc.user.bind.login',
        // 角色列表
        ROLE_LIST: 'acc.role.list',
        ROLE_UPDATE: 'acc.role.update',
        ROLE_CREATE: 'acc.role.create',
        ROLE_DELETE: 'acc.role.delete',


        // 用户自行更新资料
        USER_UPDATE_PROFILE: 'acc.profile.update',
        // 用户改密码
        USER_CHANGE_PASSWD: 'acc.user.changepwd',

        // 查询菜单
        MENU_LIST: 'acc.menu.list',
        // 菜单更新
        MENU_UPDATE: 'acc.menu.update',
        // 菜单创建
        MENU_CREATE: 'acc.menu.create',
        // 菜单删除
        MENU_DELETE: 'acc.menu.delete',



        // 列出指定角色分配好用户
        ROLE_LISTUSER: 'acc.role.listuser',
        // 给角色分配用户
        ROLE_ASSIGNUSER: 'acc.role.assignuser',
        // 取消某些用户的指定角色
        ROLE_UNASSIGNUSER: 'acc.role.unassignuser',
        // 给角色分配菜单
        ROLE_ASSIGNMENU: 'acc.role.assignmenu',
        // 权限资源组
        RESOURCE_GROUP: 'acc.role.resourcegroup',
        // 权限操作集
        RESOURCE_OPS: 'acc.role.listops',
        /**
         * 给角色分配资源操作
         */
        SAVE_OPERATIONS_TO_ROLE: 'acc.role.save.operations',
        RESOURCE_XML_PARSE: 'acc.role.resourcesxml.parse',
        RESOURCE_XML_IMPORT: 'acc.role.resourcesxml.import',

        APILOG_LIST: "acc.apilog.list"
    },
};
