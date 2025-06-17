export default (initialState: API.UserInfo) => {
  // 参考文档 https://next.umijs.org/docs/max/access
  const canView = (menu: any) => {
    if (!initialState || !initialState.menuList) {
      return false;
    }
    console.log('initialState.menuList', menu.path, initialState.menuList);
    const finded = initialState.menuList.filter(i => i.url === menu.path);
    //console.log('finded',finded);
    return finded && finded.length > 0;
  };
  return {
    canView,
  };
};
