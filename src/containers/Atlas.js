import React from 'react';
import PropTypes from 'prop-types';

import { Atlas, AtlasLegend } from 'components';

const AtlasContainer = ({ canvasURL }) => {
  return (
    <div>
      <AtlasLegend />
      { canvasURL &&
        <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
      }
      { (canvasURL == null) &&
        <Atlas width={900} height={500} />
      }
    </div>
  );
};

AtlasContainer.propTypes = {
  canvasURL: PropTypes.string,
};

export default AtlasContainer;
