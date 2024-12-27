
import { Outlet } from 'umi';
import { App, theme, ConfigProvider } from 'antd';

import { THEME_SOLUTIOIN } from '@/constants';
const Page: React.FC = () => {

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: THEME_SOLUTIOIN.token
            }}
        ><App>
                <Outlet />
            </App>
        </ConfigProvider>
    );
};
export default Page;
