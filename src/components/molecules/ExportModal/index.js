import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import {
  closeExportModal,
  startExport,
  previewExport,
} from 'store/actions';
import { fromExport } from 'store/selectors';

import { LoadingIndicator, Modal, Button, PDFIcon, PNGIcon } from 'components';

const PreviewHolder = styled.div``;
const PreviewImage = styled.img`
  max-width: 100%;
`;

const ExportPreview = ({ isPreviewing, mapPreview })=>(
  <PreviewHolder>
    <LoadingIndicator isLoading={isPreviewing} />
    { !isPreviewing && mapPreview && (
      <PreviewImage src={mapPreview} alt="Apperçu de la carte avant export"/>
    )}
  </PreviewHolder>
);

const exportModalStyle = {
  minWidth: '600px',
};
const ExportModal = ({
  isOpen,
  mapRef,
  exportInPNG,
  exportInPDF,
  isPreviewing,
  mapPreview,
  onAfterOpen,
  onClose,
})=>(
  <Modal
    style={exportModalStyle} 
    isOpen={isOpen}
    closeable={true}
    onAfterOpen={()=>onAfterOpen(mapRef)}
    onClose={onClose}>
    <ExportPreview isPreviewing={isPreviewing} mapPreview={mapPreview}/>
    <Button onClick={exportInPNG}><PNGIcon height={25} width={25}/>&nbsp;Exporter en PNG</Button>
    &nbsp;<Button onClick={exportInPDF}><PDFIcon height={25} width={25}/>&nbsp;Exporter en PDF</Button>
    
  </Modal>
);

const mapStateToProps = state => ({
  mapRef: fromExport.mapReference(state),
  isOpen: fromExport.isModalOpened(state),
  mapPreview: fromExport.mapPreview(state),
  isPreviewing: fromExport.isPreviewing(state),
});

const mapDispatchToProps = dispatch => ({
  exportInPNG: ()=>dispatch(startExport({type:'PNG'})),
  exportInPDF: ()=>dispatch(startExport({type:'PDF'})),
  onClose: ()=>dispatch(closeExportModal()),
  onAfterOpen: (mapRef)=>dispatch(previewExport(mapRef)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportModal);
