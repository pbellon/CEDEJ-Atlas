import React from 'react';
import styled from 'styled-components';

import MaeLogo from 'img/logomae.png'
import EpheLogo from 'img/logoephe.png'
import CnrsLogo from 'img/logocnrs.png'
import CedejLogo from 'img/logocedej.png'

console.log(MaeLogo, EpheLogo, CedejLogo, CnrsLogo);
const Holder = styled.div`
  display: flex;
  flex-direction: ${({horizontal})=>horizontal?'row':'column'};
  justify-content: space-between;
  align-items: center; 
  padding-top: 15px 0;
  align-self: center;
  flex-grow: 1;
  height: ${({height})=>height?height:'auto'};
`;


const ImgHolder = styled.div`
  text-align: center;
  &:last-of-type {
    margin-bottom:0;
  }
`;

const PartnersLogo = (props)=>(
  <Holder {...props}>
    <ImgHolder><img src={CedejLogo} height={110}/></ImgHolder>
    <ImgHolder><img src={CnrsLogo} height={100}/></ImgHolder>
    <ImgHolder><img src={EpheLogo} height={100}/></ImgHolder>
    <ImgHolder><img src={MaeLogo} height={110}/></ImgHolder>
  </Holder>
);

export default PartnersLogo;
