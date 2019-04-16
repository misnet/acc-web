import { queryNotices } from '@/services/api';
import {queryOssSetting,regionList} from '@/services/common';
/**
 * 给指定路径的地区对象赋值子节点列表
 * @param {*} regionList 地区列表
 * @param {*} pathIndex 要传值的路径，值类似 "350000.350011"
 * @param {*} childrenList 要赋值的子节点列表
 */
function setChildrenList(regionList,pathIndex,childrenList){
    const newPathIndex = [...pathIndex];
    const currentParentId = newPathIndex.splice(0,1);
    const restPathIndex   = newPathIndex;
    for(let i=0;i<regionList.length;i++){
        if(regionList[i]['value']  ==  currentParentId[0]){
            if(restPathIndex.length !==0 && regionList[i]['children'] )
                setChildrenList(regionList[i]['children'],restPathIndex,childrenList)
            else{
                regionList[i]['children'] = childrenList;
                regionList[i]['loading']  = false;
            }break;
        }
    }
}
export default {
    namespace: 'global',

    state: {
        collapsed: false,
        notices: [],
        ossSetting:{
            Bucket:{},
            Credentials:{},
            RequestId:"",
            AssumeRoleUser:{}
        },
        regionList:[]
    },

    effects: {
        *fetchRegionList({payload,callback},{call,put,select}){
            const response = yield call(regionList,payload);
            if(response.status === 0 ){
                let nodes = response.data;
                let childList = nodes.map(region=>{
                    return {
                        key:'r'+region.id,
                        label:region.name,
                        value:region.id,
                        parentId:region.parentId,
                        pathIndex: payload.pathIndex + '.' + region.id,
                        isLeaf:region.childNum === 0,
                        loading:false
                    };
                });
                console.log('childList',childList);
                let regionList = yield select(({global})=>global.regionList);
                if(regionList.length>0){
                    setChildrenList(regionList,payload.pathIndex.split('.').splice(1),childList);
                }else{
                    regionList = childList;
                }
                yield put({
                    type:'setRegionList',
                    payload:{
                        regionList: regionList
                    }
                });
                if(typeof callback === 'function'){
                    callback(regionList);
                }
            }
        },
        *fetchOssSetting({payload},{call,put}){
            const responseData = yield call(queryOssSetting);
            if(responseData.status === 0){
                yield put({
                    type:'saveOssSetting',
                    payload:responseData.data
                });
            }
            console.log('data',responseData.data);
        },
        *fetchNotices(_, { call, put, select }) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            });
        },
        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count = yield select(state => state.global.notices.length);
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            });
        },
        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select(state =>
                state.global.notices.map(item => {
                    const notice = { ...item };
                    if (notice.id === payload) {
                        notice.read = true;
                    }
                    return notice;
                })
            );
            yield put({
                type: 'saveNotices',
                payload: notices,
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            });
        },
    },

    reducers: {
        setRegionList(state,{payload}){
            return {
                ...state,
                regionList: payload.regionList
            }
        },
        saveOssSetting(state,{payload}){
          return {
              ...state,
              ossSetting:payload
          }  
        },
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveNotices(state, { payload }) {
            return {
                ...state,
                notices: payload,
            };
        },
        saveClearedNotices(state, { payload }) {
            return {
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },
    },

    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};
