import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { LoadingIndicator } from 'components';

const PreviewHolder = styled.div``;
const PreviewImage = styled.img`
  max-width: 100%;
`;

const ExportPreview = ({ isPreviewing, mapPreview }) => (
  <PreviewHolder>
    <LoadingIndicator isLoading={isPreviewing} />
    { !isPreviewing && mapPreview && (
      <PreviewImage src={mapPreview.url} alt="Apperçu de la carte avant export" />
    )}
  </PreviewHolder>
);

ExportPreview.propTypes = {
  mapPreview: PropTypes.object,
  isPreviewing: PropTypes.bool,
};

export default ExportPreview;
