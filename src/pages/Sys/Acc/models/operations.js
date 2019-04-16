/**
 * 权限操作的分配
 * @author Donny
 */
import { listOperationList } from '../../../../services/role';

export default {
    namespace: 'operations',

    state: {
        data: [],
    },

    effects: {
        *assign({ payload }, { call, put }) {
            console.log('PAYLOAD', payload);
        },
        *list({ payload }, { call, put }) {
            const response = yield call(listOperationList, payload);
            let data = {};
            if (typeof response['data'] != 'undefined') {
                data = response['data'];
            } else {
                data = [];
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
