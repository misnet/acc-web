import RenderAuthorized from '@/components/Authorized';
import { hasAuthority } from './auth';

let Authorized = RenderAuthorized(hasAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(hasAuthority());
};

export { reloadAuthorized };
export default Authorized;
