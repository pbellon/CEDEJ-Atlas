import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { LoadingIndicator } from 'components';

const PreviewHolder = styled.div``;
const PreviewImage = styled.img`
  max-width: 100%;
`;

const ExportPreview = ({ isPreviewing, mapPreview, t }) => (
  <PreviewHolder>
    <LoadingIndicator isLoading={isPreviewing} />
    { !isPreviewing && mapPreview && (
      <PreviewImage src={mapPreview.url} alt={t('export.altPreviewImage')} />
    )}
  </PreviewHolder>
);

ExportPreview.propTypes = {
  mapPreview: PropTypes.object,
  isPreviewing: PropTypes.bool,
};

export default translate('modals')(ExportPreview);
