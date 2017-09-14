import React from 'react';
import { connect } from 'react-redux'; 
import styled from 'styled-components';

import { Button as GenericButton } from 'components';
import { fromAtlas, fromSidebar } from 'store/selectors';
import { openExportModal } from 'store/actions';

const Button = styled(GenericButton)`
  width:100%;
  margin-top: 1em;
  pointer-events: ${({visible})=>visible?'auto':'none'};
  opacity: ${({visible})=>visible?1:0};
  transition: opacity .5s ease-in-out;
`;

const AtlasExportButton = (props)=>(
  <Button {...props }>
    Exporter
  </Button>
);

const mapStateToProps = state => ({
  visible: fromSidebar.isOpened(state),
  disabled: fromAtlas.isRendering(state),
});

const mapDispatchToProps = dispatch => ({
  onClick: ()=>(dispatch(openExportModal())),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasExportButton);
