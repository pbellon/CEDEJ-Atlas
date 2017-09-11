import React from 'react';
import { connect } from 'react-redux'; 
import styled from 'styled-components';

import { Button as GenericButton } from 'components';
import { fromAtlas } from 'store/selectors';
import { openExportModal } from 'store/actions';

const Button = styled(GenericButton)`
  width:100%;
  margin-top: 1em; 
`;

const AtlasExportButton = ({disabled, onClick})=>(
  <Button disabled={disabled} onClick={onClick}>
    Exporter
  </Button>
);

const mapStateToProps = state => ({
  disabled: fromAtlas.isRendering(state),
});

const mapDispatchToProps = dispatch => ({
  onClick: ()=>(dispatch(openExportModal())),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasExportButton);
