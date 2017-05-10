import React, { Component } from 'react';
import { connect } from 'react-redux';

import AtlasContainer from './Atlas';
import { ExportForm } from 'containers';

class Prototype extends Component {
  render(){
    const {
      isRendering,
      renderingError
    } = this.props;

    return (
      <div>
       <ExportForm />
        { isRendering &&
          <span style={ { color: 'blue' }}>RENDU EN COURS !</span>
        }
        { !isRendering && renderingError &&
          <span style={ { color: 'red' }}>{ renderingError}</span>
        }
        <AtlasContainer/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    isRendering: state.atlas.isRendering,
    renderingError: state.atlas.renderingError
  };
}

export default connect(mapStateToProps)(Prototype);
