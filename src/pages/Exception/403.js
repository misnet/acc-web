import React from 'react';
import { Link } from 'umi';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    desc={'403错误'}
    linkElement={Link}
    backText={'返回'}
  />
);

export default Exception403;
