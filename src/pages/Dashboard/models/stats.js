/**
 * 仪表盘数据管理
 * @author Donny
 */
import {statsOverview } from '../../../services/product';

import _ from 'lodash';

export default {
    namespace: 'stats',

    state: {
        shopOverview:{
            productNum:0,
            skuNum:0
        }
    },

    effects: {
        * getShopOverview({payload,callback},{call,put}){
            const response = yield call(statsOverview,payload);
            if(response.status === 0 ){
                yield put({
                    type:'setOverview',
                    payload:response.data
                });
               if(typeof callback === 'function'){
                   callback(response.data);
               }

            }
        },
    },
    reducers: {
        setOverview(state,{payload}){
            return {
                ...state,
                shopOverview:payload
            }
        },
    },
};
