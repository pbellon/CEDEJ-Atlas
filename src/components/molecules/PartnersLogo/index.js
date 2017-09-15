import React from 'react';
import styled from 'styled-components';

import MaeLogo from 'img/logomae.png'
import EpheLogo from 'img/logoephe.png'
import CnrsLogo from 'img/logocnrs.png'
import CedejLogo from 'img/logocedej.png'

const Link = styled(({to, children, title})=>(
  <a href={to} title={title} target="_blank">{ children }</a>
))``;

const Holder = styled.div`
  display: flex;
  flex-direction: ${({horizontal})=>horizontal?'row':'column'};
  justify-content: ${({horizontal})=>horizontal?'space-around':'space-between'};
  align-items: center; 
  padding-top: 15px 0;
  align-self: center;
  flex-grow: 1;
  height: ${({height})=>height?height:'auto'};
`;


const ImgHolder = styled.div`
  text-align: center;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const PartnersLogo = (props)=>(
  <Holder {...props}>
    <ImgHolder>
      <Link to={'https://www.ephe.fr/'} title={'Visiter le site de l\'École Pratique des Hautes Études'}>
        <img src={EpheLogo} height={110}/>
      </Link>
    </ImgHolder>
    <ImgHolder>
      <Link to={'https://www.cnrs.fr'} title='Visiter le site du CNRS'>
        <img src={CnrsLogo} height={100}/>
      </Link>
    </ImgHolder>
    <ImgHolder>
      <Link to={'http://cedej-eg.org'} title={'Visiter le site du CEDEJ'}>
        <img src={CedejLogo} height={110}/>
      </Link>    
    </ImgHolder>
    <ImgHolder>
      <Link to={'http://www.diplomatie.gouv.fr/fr/'} title={'Visiter le site du Ministère'}>
        <img src={MaeLogo} height={110}/>
      </Link>
    </ImgHolder>
  </Holder>
);

export default PartnersLogo;
