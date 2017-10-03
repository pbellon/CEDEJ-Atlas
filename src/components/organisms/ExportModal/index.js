import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formats from 'utils/formats';

import {
  closeExportModal,
  renderDownloadableMap,
  previewExport,
} from 'store/actions';

import {
  fromExport,
  fromLayers,
  fromFilters,
  fromCircles,
} from 'store/selectors';

import {
  Modal,
  LoadingIndicator,
  ExportPreview,
  Button,
  PDFIcon,
  PNGIcon,
} from 'components';


const exportModalStyle = {
  minWidth: '600px',
};
const ExportModal = ({
  isOpen,
  exportData,
  exportInPNG,
  exportInPDF,
  isPreviewing,
  isRendering,
  mapPreview,
  mapReference,
  onAfterOpen,
  onClose,
}) => (
  <Modal
    style={exportModalStyle}
    isOpen={isOpen}
    closeable
    onAfterOpen={() => onAfterOpen(mapReference)}
    onClose={onClose}
  >
    <ExportPreview
      isPreviewing={isPreviewing}
      mapPreview={mapPreview}
    />
    
    <LoadingIndicator isLoading={isRendering} />
    <Button onClick={exportInPNG(exportData)}>
      <PNGIcon height={25} width={25} />&nbsp;Exporter en PNG
    </Button>
    &nbsp;
    <Button onClick={exportInPDF(exportData)}>
      <PDFIcon height={25} width={25} />&nbsp;Exporter en PDF
    </Button>
  </Modal>
);

ExportModal.propTypes = {
  isOpen: PropTypes.bool,
  exportData: PropTypes.object,
  exportInPNG: PropTypes.func,
  exportInPDF: PropTypes.func,
  onAfterOpen: PropTypes.func,
  onClose: PropTypes.func,
  mapReference: PropTypes.object,
  isPreviewing: PropTypes.bool,
  isRendering: PropTypes.bool,
  mapPreview: PropTypes.object,

};

const mapStateToProps = state => ({
  exportData: {
    circleSizes: fromCircles.sizes(state),
    layers: fromLayers.layers(state),
    mapPreview: fromExport.mapPreview(state),
    mapReference: fromExport.mapReference(state),
    filters: fromFilters.filters(state),
  },
  mapReference: fromExport.mapReference(state),
  mapPreview: fromExport.mapPreview(state),
  isOpen: fromExport.isModalOpened(state),
  isPreviewing: fromExport.isPreviewing(state),
  isRendering: fromExport.isRenderingDownloadable(state),
});

const mapDispatchToProps = dispatch => ({
  exportInPNG: (data) => () => (
    dispatch(renderDownloadableMap({ format: formats.PNG, ...data }))
  ),
  exportInPDF: (data) => () => (
    dispatch(renderDownloadableMap({ format: formats.PDF, ...data }))
  ),
  onClose: () => dispatch(closeExportModal()),
  onAfterOpen: (mapRef) => dispatch(previewExport(mapRef)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportModal);
