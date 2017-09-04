import React from 'react';
import styled from 'styled-components';
import { Button as _B } from 'components';

const Button = styled(_B)`
  height: 30px;
  line-height: 30px;
  width: 100%;
  border-radius: 0;
  display: block;
  text-align: ${({align})=>align};
`;

const ToggleButton = ({ toggled, toggle, align, ...props})=>{
  const openedSign = align === 'left' ? '>' : '<';
  const closedSign = align === 'left' ? '<' : '>'; 
  return (
    <div {...props}>
      <Button align={align}
        onClick={ toggle }>
        { toggled ? openedSign : closedSign }
      </Button>
    </div>
  );
};

ToggleButton.defaultProps = {
  align: 'left',
};

export default ToggleButton; 
