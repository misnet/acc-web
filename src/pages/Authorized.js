import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority,hasPermission } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized authority={() => hasPermission('root')} noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
