import { Result } from 'antd';
import {useLocation} from 'umi';
import queryString from 'query-string';
const Page: React.FC = () => {
    const pageLocation = useLocation();
    const query = queryString.parse(pageLocation.search);
    return (
        <div>
            <Result
                status="500"
                title={query.msg?query.msg:"系统异常"}
            />
        </div>
    );
};
export default Page;
