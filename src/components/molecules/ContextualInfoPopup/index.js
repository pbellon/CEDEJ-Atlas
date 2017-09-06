import React from 'react';

import { Popup } from 'react-leaflet';
import { ContextualInfo } from 'components';

const ContextualInfoPopup = ({ show, data, position, onClose }) => {
  if(!show){ return null }
  const props = { data };
  return (
    <Popup onClose={ onClose } position={ position } >
      <ContextualInfo {...props}/> 
    </Popup>
  ); 
};

export default ContextualInfoPopup;
