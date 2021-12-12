/**
 * 角色分配给用户的业务处理模块
 * @author Donny
 */
import { listUser, assignUser, unassignUser, assignRolesToUser } from '../../../../services/role';

export default {
    namespace: 'assignUsers',

    state: {
        data: {},
    },

    effects: {
        /**
         * 指定1个用户，分配多个角色
         * @param {*} param0 
         * @param {*} param1 
         */
        *updateUserRoles({ payload, callback }, { call, put }) {
            const response = yield call(assignRolesToUser, payload);
            if (response.status === 0) {
                if ('function' === typeof callback) {
                    callback(response.data);
                }
            }
        },
        *unassign({ payload, callback }, { call, put }) {
            yield call(unassignUser, payload);


            if ('function' === typeof callback) {
                callback();
            }
        },
        *assign({ payload, callback }, { call, put }) {
            yield call(assignUser, payload);

            if ('function' === typeof callback) {
                callback();
            }

        },
        //列出已分配的用户
        *list({ payload }, { call, put }) {
            const response = yield call(listUser, payload);
            console.log('response--', response);
            let data = {};
            if (typeof response['data'] !== 'undefined') {
                data = response['data'];
            } else {
                data = {};
            }
            console.log('data', data);
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
