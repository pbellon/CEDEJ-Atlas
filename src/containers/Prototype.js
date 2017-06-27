import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ExportForm } from 'containers';

import AtlasContainer from './Atlas';

const Prototype = ({ isRendering, renderingError }) => {
  return (
    <div>
      <ExportForm />
      { isRendering &&
        <span style={{ color: 'blue' }}>RENDU EN COURS !</span>
      }
      { !isRendering && renderingError &&
        <span style={{ color: 'red' }}>{ renderingError }</span>
      }
      <AtlasContainer />
    </div>
  );
};

Prototype.propTypes = {
  isRendering: PropTypes.bool,
  renderingError: PropTypes.string,
};


const mapStateToProps = (state) => {
  return {
    isRendering: state.atlas.isRendering,
    renderingError: state.atlas.renderingError,
  };
};

export default connect(mapStateToProps)(Prototype);
