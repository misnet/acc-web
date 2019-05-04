/**
 * 角色管理的业务处理模块
 * @author Donny
 */
import { list, create, update, remove } from '../services/role';

export default {
    namespace: 'role',

    state: {
        data: [],
        modalVisible: false,
        modalType: 'create',
        editData: {
            assignPolicy:0
        },
    },

    effects: {
        //创建
        *create({ payload }, { call, put }) {
            const response = yield call(create, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });

                //提交成功
                yield put({
                    type: 'list',
                    payload: {},
                });
            }
        },
        //修改
        *update({ payload }, { select, call, put }) {
            const id = yield select(({ role }) => role.editData.id);
            const dataItem = { ...payload, id };
            const response = yield call(update, dataItem);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });
                //提交成功
                yield put({
                    type: 'list',
                    payload: {},
                });
            }
        },
        //列表
        *list({ payload }, { call, put,select }) {
            const currentApp = yield select(({app})=>app.currentApp);
            const response = yield call(list, {appId:currentApp.id,...payload});
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

        //删除
        *remove({ payload }, { call, put }) {
            const response = yield call(remove, payload);
            if (response.status == 0) {
                yield put({
                    type: 'list',
                    payload: {},
                });
            }
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
        //隐藏弹出窗
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
