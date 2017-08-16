import React from 'react';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styled, { injectGlobal } from 'styled-components';
import { font, palette } from 'styled-theme'; 

import Slider from 'rc-slider';

injectGlobal`
.rc-slider-tooltip {
  z-index: 800;
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
