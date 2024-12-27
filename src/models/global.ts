import { queryOssSetting, getRegionList } from '@/services/acc';
import { useRequest } from 'umi';
import { useState } from 'react';
import {cloneDeep} from 'lodash';
/**
 * 给指定路径的地区对象赋值子节点列表
 * @param {*} list 地区列表
 * @param {*} pathIndex 要传值的路径，值类似 "350000.350011"
 * @param {*} childrenList 要赋值的子节点列表
 */
const setChildrenList = (list, pathIndex, childrenList)=> {
    // console.log('pathIndex-----', pathIndex);
    const newPathIndex = [...pathIndex];
    const currentParentId = newPathIndex.splice(0, 1);
    const restPathIndex = newPathIndex;
    for (let i = 0; i < list.length; i++) {
        if (list[i]['value'] == currentParentId[0]) {
            if (restPathIndex.length !== 0 && list[i]['children'])
                setChildrenList(list[i]['children'], restPathIndex, childrenList)
            else {
                list[i]['children'] = childrenList;
                list[i]['loading'] = false;
            } break;
        }
    }
}
const useGlobal = () => {
    const [regionList, setRegionList] = useState<Xpod.RegionInfo[]>([]);
    const [ossSetting, setOssSettingData] = useState();
    const onFetchOssSettingRequest = useRequest(queryOssSetting, {
        manual: true,
    });
    const onFetchRegionListRequest = useRequest(getRegionList, {
        manual: true,
        fetchKey: (payload) => JSON.stringify(payload),
    });
    const loadingEffects = {
        fetchOssSetting: onFetchOssSettingRequest.loading,
        fetchRegionList:onFetchRegionListRequest.loading
    };
    const fetchOssSetting = () => {
        return onFetchOssSettingRequest.run().then((res: any) => {
            console.log('oss setting ', res);
            if (res.success) {
                setOssSettingData(res.data);
                return res;
            }
        });
    };

    const fetchRegionList =(payload:Xpod.RegionRequest)=> {
        return onFetchRegionListRequest.run(payload).then((response: any) => {
            const nodes = response.data;
            // 限制地区树的深度,国家、省、市
            let deepLimit = 3;
            const currentDeep = payload.pathIndex.split('.').length;
            const childList = nodes.map((region:Xpod.RegionInfo) => {
                return {
                    key:payload.pathIndex + '.' + region.id,
                    label: region.name,
                    value: region.id,
                    parentId: region.parentId,
                    pathIndex: payload.pathIndex + '.' + region.id,
                    isLeaf: region.childNum === 0 || deepLimit <= currentDeep,
                    childNum: deepLimit > currentDeep ? region.childNum : 0,
                    loading: false
                };
            });
            if (payload.parentId > 0) {
                // console.log('ready setChildrenList',payload.pathIndex);
                setRegionList(prev=>{
                    const list = cloneDeep(prev);
                    setChildrenList(list, payload.pathIndex.split('.').splice(1), childList);
                    return list;
                })
                
            } else {
                setRegionList(childList);
            }
            
        });
    };
    return {
        ossSetting,
        fetchRegionList,
        regionList,
        fetchOssSetting,
        loadingEffects,
    };
};

export default useGlobal;
