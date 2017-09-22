import React from 'react';
import { connect } from 'react-redux';
import formats from 'utils/formats';

import styled from 'styled-components';
import {
  closeExportModal,
  renderDownloadableMap,
  previewExport,
} from 'store/actions';
import { fromExport, fromLayers, fromFilters, } from 'store/selectors';

import { LoadingIndicator, Modal, Button, PDFIcon, PNGIcon } from 'components';

const PreviewHolder = styled.div``;
const PreviewImage = styled.img`
  max-width: 100%;
`;

const ExportPreview = ({ isPreviewing, mapPreview })=>(
  <PreviewHolder>
    <LoadingIndicator isLoading={isPreviewing} />
    { !isPreviewing && mapPreview && (
      <PreviewImage src={mapPreview.url} alt="Apperçu de la carte avant export"/>
    )}
  </PreviewHolder>
);

const exportModalStyle = {
  minWidth: '600px',
};
const ExportModal = ({
  isOpen,
  mapReference,
  exportInPNG,
  exportInPDF,
  filters,
  layers,
  isPreviewing,
  isRendering,
  mapPreview,
  onAfterOpen,
  onClose,
})=>(
  <Modal
    style={exportModalStyle} 
    isOpen={isOpen}
    closeable={true}
    onAfterOpen={()=>onAfterOpen(mapReference)}
    onClose={onClose}>
    <ExportPreview isPreviewing={isPreviewing} mapPreview={mapPreview}/>
    
    <LoadingIndicator isLoading={isRendering}/>
    <Button onClick={exportInPNG({mapReference, mapPreview, layers, filters})}>
      <PNGIcon height={25} width={25}/>&nbsp;Exporter en PNG
    </Button>
    &nbsp;
    <Button onClick={exportInPDF({mapReference, mapPreview, layers, filters})}>
      <PDFIcon height={25} width={25}/>&nbsp;Exporter en PDF
    </Button>
    
  </Modal>
);

const mapStateToProps = state => ({
  layers: fromLayers.layers(state),
  filters: fromFilters.filters(state),
  mapReference: fromExport.mapReference(state),
  isOpen: fromExport.isModalOpened(state),
  mapPreview: fromExport.mapPreview(state),
  isPreviewing: fromExport.isPreviewing(state),
  isRendering: fromExport.isRenderingDownloadable(state),
});

const mapDispatchToProps = dispatch => ({
  exportInPNG: (data)=>()=>(
    dispatch(renderDownloadableMap({format:formats.PNG, ...data}))
  ),
  exportInPDF: (data)=>()=>(
    dispatch(renderDownloadableMap({format:formats.PDF, ...data}))
  ),
  onClose: ()=>dispatch(closeExportModal()),
  onAfterOpen: (mapRef)=>dispatch(previewExport(mapRef)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportModal);
