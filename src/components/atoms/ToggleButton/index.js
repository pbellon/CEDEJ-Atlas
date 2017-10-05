import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button as _B } from 'components';

const BUTTON_HEIGHT = 25;
const Button = styled(_B)`
  height: ${BUTTON_HEIGHT}px;
  line-height: ${BUTTON_HEIGHT}px;
  font-weight: bold;
  font-size: 0.8rem;
  width: 100%;
  border-radius: 0;
  display: block;
  position: relative;
`;

const Symbol = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  left: ${({ align }) => align === 'left' ? '17px' : 'auto'};
  right: ${({ align }) => align === 'right' ? '17px' : 'auto'};
`;

const ToggleSymbol = ({ align, toggled }) => {
  const openedSign = align === 'left' ? '>' : '<';
  const closedSign = align === 'left' ? '<' : '>';
  const symbolToUse = toggled ? openedSign : closedSign;
  return (<Symbol align={align}><span>{ symbolToUse }</span></Symbol>);
};

ToggleSymbol.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  toggled: PropTypes.bool,
};

const ToggleButton = ({ toggled, toggle, align, children, ...props }) => (
  <div {...props}>
    <Button
      align={align}
      onClick={toggle}
    >
      <ToggleSymbol align={align} toggled={toggled} />
      { children }
    </Button>
  </div>
);

ToggleButton.propTypes = {
  ...ToggleSymbol.propTypes,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

ToggleButton.defaultProps = {
  align: 'left',
};

export default ToggleButton;
