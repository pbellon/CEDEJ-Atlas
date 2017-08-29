import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  loadData,
  renderSuccess,
  showContextualInfo,
  hideContextualInfo,
  setCircleSizesRefs,
  zoom,
} from 'store/actions';

import { fromAtlas, fromFilters, fromLayers } from 'store/selectors';
import { Atlas, AtlasLegend, LoadingIndicator } from 'components';

const Holder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

`;

const Error = styled.span`
  color: red;
`;

class AtlasContainer extends Component {
  componentDidMount(){
    this.props.loadData();
  }

  render(){
    const {
      canvasURL,
      data,
      error,
      showContextualInfo,
      hideContextualInfo,
      showAreas,
      showCircles,
      isRendering,
      onZoom,
      onCirclesCreated, 
      onRender
    } = this.props;
    return (
      <Holder>
        <LoadingIndicator isLoading={ isRendering }/>
        { error &&
          <Error>{error.message}</Error>
        }
        { canvasURL &&
          <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
        }
        { data && (
          <Atlas width={900} height={500} data={data}
            showContextualInfo={ showContextualInfo }
            hideContextualInfo={ hideContextualInfo }
            onZoomEnd={ onZoom } 
            onRender={ onRender }
            onCirclesCreated={ onCirclesCreated }
            showAreas={ showAreas }
            showCircles={ showCircles }/>
        )}
        
        <AtlasLegend/>

      </Holder>
    );
  }
}

AtlasContainer.propTypes = {
  loadData: PropTypes.func.isRequired,
  canvasURL: PropTypes.string,
  data: PropTypes.shape({
    aridity:PropTypes.array,
    circles:PropTypes.array,
    temperatures: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  isContextualInfoVisible: fromAtlas.isContextualInfoVisible(state),
  isRendering: fromAtlas.isRendering(state),
  showAreas: fromLayers.isLayerVisible(state, fromLayers.temperatures(state)),
  showCircles: fromLayers.isLayerVisible(state, fromLayers.circles(state)),
  data: fromFilters.data(state),
  error: state.atlas.error,
});

const mapDispatchToProps = dispatch => ({
  onZoom: ()=>dispatch(zoom()),
  onCirclesCreated: (circleSizes)=>dispatch(setCircleSizesRefs(circleSizes)),
  showContextualInfo: (data)=> dispatch(showContextualInfo(data)),
  hideContextualInfo: ()=>dispatch(hideContextualInfo()),
  loadData: ()=> dispatch(loadData()),
  onRender: ()=> dispatch(renderSuccess())
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasContainer);
