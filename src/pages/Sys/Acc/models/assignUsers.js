/**
 * 角色分配给用户的业务处理模块
 * @author Donny
 */
import { listUser, assignUser, unassignUser } from '../../../../services/role';

export default {
    namespace: 'assignUsers',

    state: {
        data: {},
    },

    effects: {
        *unassign({ payload }, { call, put }) {
            yield call(unassignUser, payload);

            yield put({
                type: 'list',
                payload: { rid: payload.rid },
            });
        },
        *assign({ payload }, { call, put }) {
            yield call(assignUser, payload);
            yield put({
                type: 'list',
                payload: { rid: payload.rid },
            });
        },
        //列出已分配的用户
        *list({ payload }, { call, put }) {
            console.log('response========');
            const response = yield call(listUser, payload);
            //console.log('response', response);
            let data = {};
            if (typeof response['data'] !== 'undefined') {
                data = response['data'];
            } else {
                data = {};
            }
            yield put({
                type: 'save',
                payload: data,
            });
        },
    },
    //redux

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
