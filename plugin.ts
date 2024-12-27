import { IApi } from 'umi';

export default (api: IApi) => {
    api.modifyHTML(($) => {
        $('head').append([
            `<script src="https://gosspublic.alicdn.com/aliyun-oss-sdk-6.20.0.min.js" type="application/javascript"/>`,
            `<script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>`,
            `<script>LA.init({id:"3KkbohaWD3K1Nmfk",ck:"3KkbohaWD3K1Nmfk"})</script>`
        ])
        return $;
    });
};