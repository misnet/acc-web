/**
 * 配置相关
 *
 */
export default {
  /**
   * 取得API配置
   * @returns {object}
   */
  getOption() {
    const defaultOption = {
      gateway: 'http://acc.api.kuga.wang/v3/gateway',
      appKey: 1000,
      appSecret: 'IsuZLMPJDVnwYp8XYp/Pf4HH6e5PY28c8oQy8akF5vWxMjvvSNORdPvDu6HK9eOAGcVmDk1jLRYIkAcGu7tgUQ=='
    };
    let newOption = {...defaultOption};
    if (process.env.API_GATEWAY) {
      newOption.gateway = process.env.API_GATEWAY;
    }
    if (process.env.API_KEY) {
      newOption.appKey = process.env.API_KEY;
    }
    if (process.env.API_SECRET) {
      newOption.appSecret = process.env.API_SECRET;
    }
    console.log('process.env.API_SECRET',process.env.API_SECRET);
    console.log('newOption',process.env.API_GATEWAY);
    return newOption;
  },
  SYS_NAME:process.env.TITLE?process.env.TITLE:'Kuga ACC',
  DATE_FORMAT:'YYYY年MM月DD日 HH:mm:ss'
};
