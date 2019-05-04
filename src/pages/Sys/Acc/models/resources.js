/**
 * 权限资源
 * @author Donny
 */
import { listResourceGroup,parseResourceXml,importResourceXml } from '@/services/role';
import { notification } from 'antd';

export default {
    namespace: 'resources',

    state: {
        data: [],
        parsedResources:null,
        parsedKey:null,
        importedStatus:false
    },

    effects: {
        
        *importResources({payload,callback},{call,put}){
            const response  = yield call(importResourceXml,payload);
            if(response.data){
                //导入成功
                notification.success({
                    message:'提示',
                    description:'导入成功'
                });
            }else{
                notification.warn({
                    message:'提示',
                    description:'导入失败'
                });
            }
            if(typeof callback == 'function'){
                callback(response.data);
            }
        },
        *preparseXml({payload},{call,put}){
            yield put({
                type:'setParsedXml',
                payload:{
                    parsedKey:null,
                    parsedResources:null
                }
            });
            const response  = yield call(parseResourceXml,payload);
            if(response.status===0){
                yield put({
                    type:'setParsedXml',
                    payload:{
                        parsedKey:response.data.parsedKey,
                        parsedResources:response.data.resources
                    }
                });
            }
        },
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
                payload: data         
            });
        },
    },
    //redux

    reducers: {
        setParsedXml(state,{payload}){
            return {
                ...state,
                parsedKey:payload.parsedKey?payload.parsedKey:null,
                parsedResources:payload.parsedResources?payload.parsedResources:null
            }
        },
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
