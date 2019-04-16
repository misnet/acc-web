/**
 * 配置相关字典
 *
 */
let DICT = {
    ROLE_ASSIGN_POLICY_NOAUTO:0,
    ROLE_ASSIGN_POLICY_TO_LOGINED:1,
    ROLE_ASSIGN_POLICY_TO_UNLOGINED:2,
    GENDER_MALE:1,
    GENDER_FEMAILE:2,
    GENDER_SECRET:0,
    FORM_TYPE:{
        'TEXT':1,
        'RADIO':2,
        'CHECKBOX':3,
        'TEXTAREA':4,
        'IMAGE':5
    }
}
DICT.FORM_TYPE.list  = [
    {id:DICT.FORM_TYPE.TEXT, name:'输入框'},
    {id:DICT.FORM_TYPE.RADIO, name:'单选框'},
    {id:DICT.FORM_TYPE.CHECKBOX, name:'多选框'},
    {id:DICT.FORM_TYPE.TEXTAREA, name:'多行输入框'},
    {id:DICT.FORM_TYPE.IMAGE, name:'媒体图片'}
];
export default DICT;