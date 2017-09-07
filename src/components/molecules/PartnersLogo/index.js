import React from 'react';
import styled from 'styled-components';

import MaeLogo from 'img/logomae.png'
import EpheLogo from 'img/logoephe.png'
import CnrsLogo from 'img/logocnrs.png'
import CedejLogo from 'img/logocedej.png'

console.log(MaeLogo, EpheLogo, CedejLogo, CnrsLogo);
const Holder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 15px 0;
  align-self: center;
  flex-grow: 1;
`;
const ImgHolder = styled.div`
  text-align: center;
  &:last-of-type {
    margin-bottom:0;
  }
`;
const PartnersLogo = ()=>(
  <Holder>
    <ImgHolder><img src={CedejLogo} height={110}/></ImgHolder>
    <ImgHolder><img src={CnrsLogo} height={80}/></ImgHolder>
    <ImgHolder><img src={EpheLogo} height={50}/></ImgHolder>
    <ImgHolder><img src={MaeLogo} height={110}/></ImgHolder>
  </Holder>
);

export default PartnersLogo;
