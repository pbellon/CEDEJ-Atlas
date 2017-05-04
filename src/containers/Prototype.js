import React, { Component } from 'react';
import { connect } from 'react-redux';
import { canvasRender } from 'store/actions';

import AtlasContainer from './Atlas';
import { ExportForm } from 'containers';

class Prototype extends Component {
  setImage(data){
    const action = canvasRender(data);
    console.log('setImage bande de batards',);
    this.props.dispatch(action);
  }
  render(){
    const {
      isRendering,
      printedFileURL,
      renderedImage,
      renderingError
    } = this.props;

    if(!isRendering && printedFileURL){
      window.open(printedFileURL);
    }
    return (
      <div>
       <ExportForm />
        { isRendering &&
          <span style={ { color: 'blue' }}>RENDU EN COURS !</span>
        }
        { !isRendering && renderingError &&
          <span style={ { color: 'red' }}>{ renderingError}</span>
        }
        <AtlasContainer onRendered={ (img)=>this.setImage(img) }/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    canvas: state.atlas.canvasURL,
    printedFileURL: state.atlas.fileURL,
    isRendering: state.atlas.isRendering,
    renderingError: state.atlas.renderingError
  };
}

export default connect(mapStateToProps)(Prototype);
