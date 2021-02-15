import React from 'react';
import { Link } from 'umi';
import Exception from '@/components/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc={'错误描述'}
    linkElement={Link}
    backText={'返回'}
  />
);

export default Exception500;
