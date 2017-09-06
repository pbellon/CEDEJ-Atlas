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
  justify-content: space-around;
  max-height: 600px;
  padding-top: 50px;
  align-self: center;
`;
const ImgHolder = styled.div`
  text-align: center;
  margin-bottom: 2em;
`;
const PartnersLogo = ()=>(
  <Holder>
    <ImgHolder><img src={CedejLogo} height={150}/></ImgHolder>
    <ImgHolder><img src={CnrsLogo} height={100}/></ImgHolder>
    <ImgHolder><img src={EpheLogo} height={50}/></ImgHolder>
    <ImgHolder><img src={MaeLogo} height={150}/></ImgHolder>
  </Holder>
);

export default PartnersLogo;
