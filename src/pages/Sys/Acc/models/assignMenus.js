/**
 * 菜单分配给角色的业务处理模块
 * @author Donny
 */
import { assignMenu } from '../../../../services/role';

export default {
    namespace: 'assignMenus',

    state: {
        data: [],
    },

    effects: {
        *assign({ payload }, { call, put }) {
            //menu/menuList的data变化了，要通知过去
            yield put({
                type: 'menu/setMenuAllow',
                payload: { menuIds: payload.menuIds },
            });

            yield call(assignMenu, payload);
        },
    },
};
