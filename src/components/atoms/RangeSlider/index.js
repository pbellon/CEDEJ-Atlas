import React from 'react';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styled, { injectGlobal } from 'styled-components';
import { font, palette } from 'styled-theme'; 

import theme from 'components/themes/default'; 
import Slider from 'rc-slider';

injectGlobal`
.rc-slider {
  padding: 4px 0;
}
.rc-slider-tooltip {
  z-index: 800;
  font-familiy: 'Helvetica';
}
.rc-slider-track {
  background-color: ${theme.palette.primary[0]};
}
.rc-slider-tooltip-inner {
  font-size: 0.7rem;
  box-shadow: 0 0 3px #bbb; 
  border-radius: 0;
  padding-left: 2px;
  padding-right: 2px;
}

.rc-slider-disabled {
  background-color: transparent;
}

.rc-slider-handle {
  border: transparent;
  background-color: white;
}
`;

const Range = Slider.createSliderWithTooltip(Slider.Range);

const Holder = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`; 

const RangeSlider = (props)=>{
  return <Holder><Range { ...props }/></Holder>;
}

export default RangeSlider;
