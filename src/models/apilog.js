import { apiLogList } from '../services/apilog';
import { indexOf } from 'lodash';
export default {
    namespace: 'apiLog',
    state: {
        data: {
            list:[],
            total:0,
            page:1,
            limit:9
        }
    },

    effects: {
        
        //列表
        *apiLogList({ payload }, { call, put }) {
            const response = yield call(apiLogList, payload);
            let data = {};
            if(response.status == 0){
                if (typeof response['data'] != 'undefined') {
                    data = response['data'];
                } else {
                    data = {list:[],total:0,page:1,limit:10};
                }
                yield put({
                    type: 'save',
                    payload: data,
                });
            }
        }
    },
    //redux

    reducers: {
        
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        }
    },
};
