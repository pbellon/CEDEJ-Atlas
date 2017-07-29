import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const FilterDiv = styled.div`
  color: ${palette('grayscale', 1)};
  &.disabled {
    color: ${palette('grayscale', 4)};
  }
`;

const Filter = ({children, onClick, ...props}, context)=>{
  const disabled = !context.isLayerVisible;
  const _onClick = ()=>{
    if(!disabled){ onClick(); }
  };
  const className = disabled ? 'disabled' : '';
  return (
    <FilterDiv onClick={ _onClick } {...props} className={ className }>
      { children }
    </FilterDiv>
  );
}

Filter.contextTypes = {
  isLayerVisible: PropTypes.bool,
};

export default Filter;
