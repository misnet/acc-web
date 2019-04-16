import { menuList as queryMenus, createMenu, updateMenu, deleteMenu } from '../services/menu';
import { indexOf } from 'lodash';
export default {
    namespace: 'menu',

    state: {
        data: [],
        modalVisible: false,
        modalType: 'create',
        editMenu: {},
    },

    effects: {
        //创建
        *create({ payload }, { call, put }) {
            const response = yield call(createMenu, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });

                //提交成功
                yield put({
                    type: 'menuList',
                    payload: {},
                });
            }
        },
        //修改
        *update({ payload }, { select, call, put }) {
            const id = yield select(({ menu }) => menu.editMenu.id);
            const menuItem = { ...payload, id };
            const response = yield call(updateMenu, menuItem);
            if (response.status == 0) {
                yield put({
                    type: 'hideModal',
                });
                //提交成功
                yield put({
                    type: 'menuList',
                    payload: {},
                });
            }
        },
        //列表
        *menuList({ payload }, { call, put ,select}) {
            //结合当前APP
            const currentApp = yield select(({app})=>app.currentApp);
            const response = yield call(queryMenus, {appId:currentApp.id,...payload});
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
            console.log('-------',data);
            return data;
        },

        //删除菜单
        *deleteMenu({ payload }, { call, put }) {
            const response = yield call(deleteMenu, payload);
            if (response.status == 0) {
                yield put({
                    type: 'menuList',
                    payload: {},
                });
            }
        },
    },
    //redux

    reducers: {
        //改变data中allow的值，在给角色分配菜单时需要调用这个方法
        setMenuAllow(state, action) {
            const { menuIds } = action.payload;
            const ids = menuIds.split(',');
            let newData = [];
            state.data.map(item => {
                let newItem = Object.assign({}, item);
                if (ids.length > 0 && indexOf(ids, item.id+'') != -1) {
                    newItem['allow'] = 1;
                } else {
                    newItem['allow'] = 0;
                }

                if (item.children) {
                    newItem['children'] = [];
                    item.children.map(childItem => {
                        let newChildItem = Object.assign({}, childItem);
                        if (ids.length > 0 && indexOf(ids, childItem.id+'') != -1) {
                            newChildItem['allow'] = 1;
                        } else {
                            newChildItem['allow'] = 0;
                        }
                        newItem['children'].push(newChildItem);
                    });
                }
                newData.push(newItem);
            });
            return {
                ...state,
                data: newData,
            };
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
