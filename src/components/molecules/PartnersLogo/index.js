import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MaeLogo from 'img/logomae.png';
import EpheLogo from 'img/logoephe.png';
import CnrsLogo from 'img/logocnrs.png';
import CedejLogo from 'img/logocedej.png';

const Link = styled(({ to, children, title }) => (
  <a href={to} title={title} rel="noopener noreferrer" target="_blank">{ children }</a>
))``;

const Holder = styled.div`
  display: flex;
  flex-direction: ${({ horizontal }) => horizontal ? 'row' : 'column'};
  justify-content: ${({ horizontal }) => horizontal ? 'space-around' : 'space-between'};
  align-items: center;
  padding-top: 15px 0;
  align-self: center;
  flex-grow: 1;
  height: ${({ height }) => height || 'auto'};
`;


const ImgHolder = styled.div`
  text-align: center;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const PartnersLogo = (props) => (
  <Holder {...props}>
    <ImgHolder>
      <Link to={'https://www.ephe.fr/'} title="Visiter le site de l'École Pratique des Hautes Études">
        <img alt="Logo EPHEE" src={EpheLogo} height={props.horizontal ? 80 : 110} />
      </Link>
    </ImgHolder>
    <ImgHolder>
      <Link to={'http://www.cnrs.fr'} title="Visiter le site du CNRS">
        <img alt="Logo CNRS" src={CnrsLogo} height={props.horizontal ? 70 : 100} />
      </Link>
    </ImgHolder>
    <ImgHolder>
      <Link to={'http://cedej-eg.org'} title="Visiter le site du CEDEJ">
        <img alt="Logo CEDEJ" src={CedejLogo} height={props.horizontal ? 80 : 110} />
      </Link>
    </ImgHolder>
    <ImgHolder>
      <Link to={'http://www.diplomatie.gouv.fr/fr/'} title="Visiter le site du Ministère">
        <img alt="Logo MAE" src={MaeLogo} height={props.horizontal ? 70 : 110} />
      </Link>
    </ImgHolder>
  </Holder>
);

PartnersLogo.propTypes = {
  horizontal: PropTypes.bool,
};

export default PartnersLogo;
