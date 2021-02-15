import { Redirect } from 'umi'
import { hasAuthority } from '@/utils/auth';
export default (props) => {
    const isLogin = hasAuthority();
    if (isLogin) {
        return <>{props.children}</>;
    } else {
        return <Redirect to="/user/login" />;
    }
}