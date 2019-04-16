import { queryUsers, queryCurrent, createUser, updateUser, deleteUser, changePasswd } from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    modalVisible: false,
    modalType: 'create',
    currentUser: {},
    editUser: {},
  },

  effects: {
    * changePassword({payload,callback},{call,put}){
      const response  = yield call(changePasswd,payload);
      if(response.status === 0){
        if(typeof callback === 'function'){
          callback(true);
        }
      }
    },
    //创建
    * create ({payload}, {call, put}) {
      const response = yield call(createUser, payload);
      if (response.status == 0) {
        yield put({
          type: 'hideModal',
        });

        //提交成功
        yield put({
          type: 'userList',
          payload: {},
        });
      }
    },
    //修改
    * update ({payload}, {select, call, put}) {
      const uid = yield select(({user}) => user.editUser.uid);
      const userItem = {...payload, uid};
      const response = yield call(updateUser, userItem);
      if (response.status == 0) {
        yield put({
          type: 'hideModal',
        });
        //提交成功
        yield put({
          type: 'userList',
          payload: {},
        });
      }
    },
    //列表
    * userList ({payload}, {call, put}) {
      const response = yield call(queryUsers, payload);
      let data = {};
      if (typeof response['data']['total'] !== 'undefined') {
        data = response['data'];
      } else {
        data = {total: 0, list: [], page: 1, limit: 10};
      }
      yield put({
        type: 'save',

        payload: data,
      });
    },
    //取当前登录的用户
    * fetchCurrent (_, {call, put}) {
      const response = yield call(queryCurrent);
      //console.log('response',response);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    //删除用户
    * deleteUser ({payload},{call,put}) {
      const response = yield call(deleteUser,payload);
      if(response.status ==0 ){
        yield put({
          type: 'userList',
          payload: {},
        });
      }
    }
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    //隐藏弹出窗
    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
      };
    },
    showModal (state, {payload}) {
      return {
        ...state,
        ...payload,
        modalVisible: true,
      };
    },
    saveCurrentUser (state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
