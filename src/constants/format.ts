import { DICT } from './index';
export function getRoleAssignPolicyText(value: number) {
    const finded = DICT.ROLE_ASSIGN_POLICY.find((item) => {
        return item.value === value;
    });
    return finded ? finded.label : '';
}