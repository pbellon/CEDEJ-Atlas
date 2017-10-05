import React from 'react';
import { SvgIcon } from 'components';

const lineStyle = {
  strokeWidth: 2,
  strokeMitterlimit: 10,
};

const CloseIcon = () => (
  <SvgIcon
    viewBox="0 0 32 32"
    style={{
      enableBackground: 'new 0 0 32 32',
    }}
  >
    <line style={lineStyle} x1="8" y1="8" x2="24" y2="24" fill="none" />
    <line style={lineStyle} x1="24" y1="8" x2="8" y2="24" fill="none" />
  </SvgIcon>
);

export default CloseIcon;
