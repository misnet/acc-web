import { isUrl } from '../utils/utils';
import { DashboardOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
const menuData = [
  {
    name: '全部应用',
    icon: <DashboardOutlined />,
    path: 'dashboard/workplace'
  },
  {
    name: '全部用户',
    icon: <UserOutlined />,
    path: 'sys/all-userlist',

  },
  {
    name: 'API访问',
    icon: <DatabaseOutlined />,
    path: 'sys/apilog-list',

  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }

    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

/**
 * 结合服务端返回的菜单数据，判断所有菜单，过滤掉不在服务端返回的菜单
 * @param serverMenuData
 * @param menuData
 * @returns {Array}
 */
function filterMenu(serverMenuData, menuData) {
  let newData = [];
  if (!serverMenuData) {
    return newData;
  }
  menuData.map(item => {
    if (item.children) {
      let children = filterMenu(serverMenuData, item.children)
      if (Array.isArray(children) && children.length > 0) {
        newData.push(Object.assign({}, item, { children }));
      }
    } else if (serverMenuData.some(smenu => smenu.url == item.path)) {
      newData.push(Object.assign({}, item));
    } else if (item.authority === 'common') {
      newData.push(item);
    }
  });
  return newData;
}
export const getMenuData = (serverMenuData = []) => {
  //暂取消通过服务端来过滤菜单，直接从本地读
  //return filterMenu(serverMenuData, formatter(menuData))
  return formatter(menuData);
};
