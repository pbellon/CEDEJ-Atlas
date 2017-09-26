import React from 'react';
import { connect } from 'react-redux'; 
import styled from 'styled-components';

import { Button as GenericButton } from 'components';
import { fromAtlas, fromSidebar } from 'store/selectors';
import { openExportModal } from 'store/actions';

const Button = styled(GenericButton)`
  width:100%;
  pointer-events: ${({visible})=>visible?'auto':'none'};
  opacity: ${({visible})=>visible?1:0};
  transition: opacity .5s ease-in-out;
`;

const Holder = styled.div`
  position: fixed;
  left: 0;
  right:0;
  bottom:0;
`;

const AtlasExportButton = (props)=>(
  <Holder>
    <Button {...props }>
      Exporter
    </Button>
  </Holder>
);

const mapStateToProps = state => ({
  visible: fromSidebar.isOpened(state),
  disabled: fromAtlas.isRendering(state),
});

const mapDispatchToProps = dispatch => ({
  onClick: ()=>(dispatch(openExportModal())),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasExportButton);
