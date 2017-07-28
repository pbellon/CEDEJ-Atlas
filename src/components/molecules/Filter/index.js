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

const Filter = ({children, ...props}, context)=>{
  const disabled = !context.isLayerVisible;
  const className = disabled ? 'disabled' : '';
  return (
    <FilterDiv {...props} className={ className }>
      { children }
    </FilterDiv>
  );
}

Filter.contextTypes = {
  isLayerVisible: PropTypes.bool,
};

export default Filter;
