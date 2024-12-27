declare namespace Kuga {
    /**
     * 用户登陆后的信息
     */
    interface UserInfo {
        uid: number;
        username?: string;
        refreshToken: string;
        refreshTokenExpiredIn: number;
        mobile?: string;
        email?: string;
        accessToken: string;
        accessTokenExpiredIn: number;
        fullname: string;
        name?: string;
        avatar?: string;
        menuList?: MenuItem[];
    }
}