/**
 * 查询OSSSetting
 * @returns {Object}
 */
import {request} from 'umi';
import {API_CONFIG} from '@/constants/index';
export async function queryOssSetting(){
    return request(`${API_CONFIG.ACC_API_HOST}/common.osssetting`, {
        method: 'POST'
    });
}
export async function getRegionList(payload){
    return request(`${API_CONFIG.ACC_API_HOST}/common.region.list`, {
        method: 'POST',
        data:payload
    });
}