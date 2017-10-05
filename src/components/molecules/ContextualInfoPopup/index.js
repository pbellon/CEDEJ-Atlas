import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';
import { ContextualInfo } from 'components';

const ContextualInfoPopup = ({ show, data, position, onClose }) => {
  if (!show) { return null; }
  const props = { data };
  return (
    <Popup onClose={onClose} position={position} >
      <ContextualInfo {...props} />
    </Popup>
  );
};

ContextualInfoPopup.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool,
  position: PropTypes.object,
  data: PropTypes.object,
};

export default ContextualInfoPopup;
