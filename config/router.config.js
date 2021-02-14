export default [
    {
        path: "/user",
        component: "../layouts/UserLayout",
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: './User/Login' }
        ]
    },

    { path: "/404", component: "./Exception/404" },
    { path: "/500", component: "./Exception/500" },
    {
        path: "/",
        component: "../layouts/BasicLayout",
        Routes: ['src/pages/Authorized'],
        routes: [

            { path: "/", redirect: "/dashboard/workplace" },

            { path: "/exception/404", component: "./Exception/404" },
            { path: "/exception/500", component: "./Exception/500" },
            {
                path: "/account/profile", component: "./User/Profile"
            },
            { path: "/dashboard/workplace", component: "./Dashboard/Workplace" },
            { path: "/sys/userlist", component: "./Sys/UserList" },
            { path: "/sys/all-userlist", component: "./Sys/AllUserList" },
            { path: "/sys/apilog-list", component: "./Sys/ApiLogList" },
            { path: "/sys/menulist", component: "./Sys/MenuList" },
            {
                path: "/sys/rolelist",
                routes: [
                    {
                        path: '/sys/rolelist/index', component: "./Sys/Acc/RoleList"
                    },
                    {
                        path: '/sys/rolelist/assign-role-users/:rid', component: './Sys/Acc/AssignUserToRole'
                    },
                    {
                        path: '/sys/rolelist/assign-role-menu/:rid', component: './Sys/Acc/AssignMenuToRole'
                    },
                    {
                        path: '/sys/rolelist/role-res/:rid', component: './Sys/Acc/ResourcesList'
                    },
                    {
                        path: '/sys/rolelist/assign-role-res/:rid/:rcode/:rname', component: './Sys/Acc/AssignResToRole'
                    },
                    {
                        component: './Exception/404'
                    }
                ]
            },
            {
                component: './Exception/404'
            }
        ]
    }
];