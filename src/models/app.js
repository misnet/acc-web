import { appList, createApp, updateApp, deleteApp } from '../services/app';
import { indexOf } from 'lodash';
export default {
    namespace: 'app',
    state: {
        data: {
            list:[],
            total:0,
            page:1,
            limit:9
        },
        modalVisible: false,
        modalType: 'create',
        editData: {},
        currentApp:{
            id:null,
            name:''
        }
    },

    effects: {
        //创建
        *create({ payload }, { call, put }) {
            const response = yield call(createApp, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });

                //提交成功
                yield put({
                    type: 'appList',
                    payload: {},
                });
            }
        },
        //修改
        *update({ payload }, { select, call, put }) {
            const id = yield select(({ app }) => app.editData.id);
            const appItem = { ...payload, id };
            const response = yield call(updateApp, appItem);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });
                //提交成功
                yield put({
                    type: 'appList',
                    payload: {},
                });
            }
        },
        //列表
        *appList({ payload }, { call, put }) {
            const response = yield call(appList, payload);
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
        },

        //删除
        *deleteApp({ payload }, { call, put }) {
            const response = yield call(deleteApp, payload);
            if (response.status == 0) {
                yield put({
                    type: 'appList',
                    payload: {},
                });
            }
        },
    },
    //redux

    reducers: {
        setCurrentApp(state,action){
            return {
                ...state,
                currentApp:action.payload
            }
        },
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        // 隐藏弹出窗
        hideModal(state) {
            return {
                ...state,
                modalVisible: false,
            };
        },
        showModal(state, { payload }) {
            return {
                ...state,
                ...payload,
                modalVisible: true,
            };
        },
    },
};
