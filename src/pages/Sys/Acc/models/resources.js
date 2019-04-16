/**
 * 权限资源
 * @author Donny
 */
import { listResourceGroup } from '../../../../services/role';

export default {
    namespace: 'resources',

    state: {
        data: [],
    },

    effects: {
        *list({ payload }, { call, put }) {
            const response = yield call(listResourceGroup, payload);
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
