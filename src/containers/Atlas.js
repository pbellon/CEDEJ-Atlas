import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import {
  loadData,
  renderSuccess,
  mapReady,
  showContextualInfo,
  hideContextualInfo,
  bindMapReference,
  setCircleSizesRefs,
  onAdd,
  zoom,
} from 'store/actions';

import {
  fromSidebar,
  fromAtlas,
  fromFilters,
  fromLayers,
} from 'store/selectors';

import {
  Atlas,
  LoadingIndicator,
  Sidebar,
  TutorialModal,
  AtlasFilters,
  SidebarToggleButton,
  AtlasExportButton,
} from 'components';

import { Sidebar as SidebarContainer, AtlasLegend } from 'containers';

const Holder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Error = styled.span`
  color: red;
`;

class AtlasContainer extends Component {
  static propTypes = {
    counts: PropTypes.shape({
      aridity: PropTypes.object,
      temperatures: PropTypes.object,
    }),
    data: PropTypes.shape({
      deserts: PropTypes.object,
      aridity: PropTypes.object,
      circles: PropTypes.object,
      temperatures: PropTypes.object,
    }),
    circleTypes: PropTypes.object,
    error: PropTypes.object,
    isRendering: PropTypes.bool,
    isSidebarOpened: PropTypes.bool,
    showTemperatures: PropTypes.bool,
    showAridity: PropTypes.bool,
    showCircles: PropTypes.bool,
    onZoom: PropTypes.func,
    onCirclesCreated: PropTypes.func,
    onCirclesAdded: PropTypes.func,
    onRender: PropTypes.func,
    loadData: PropTypes.func.isRequired,
    bindMapReference: PropTypes.func.isRequired,
  }
  
  componentDidMount() {
    this.props.loadData();
  }

  render() {
    const {
      mapReference,
      canvasURL,
      circleTypes,
      bindMapReference,
      data,
      counts,
      error,
      showAridity,
      showTemperatures,
      showCircles,
      isRendering,
      isSidebarOpened,
      onZoom,
      onCirclesCreated,
      onCirclesAdded,
      onRender,
      onMapReady,
      onMapPage,
    } = this.props;
    return (
      <Holder className='atlas-holder'>
        <LoadingIndicator isLoading={isRendering} />
        { error &&
          <Error>{ error.message }</Error>
        }
        { data && (
          <Atlas
            bindMapReference={bindMapReference}
            data={data}
            counts={counts}
            circleTypes={circleTypes}
            isSidebarOpened={isSidebarOpened}
            onZoom={onZoom}
            onRender={onRender}
            onMapReady={onMapReady}
            onCirclesCreated={onCirclesCreated}
            onCirclesAdded={onCirclesAdded}
            showAridity={showAridity}
            showTemperatures={showTemperatures}
            showCircles={showCircles}
          />)
        }
        { data && (<AtlasLegend />) }
        <Sidebar zIndex={1000}>
          <SidebarToggleButton />
          <SidebarContainer>
            <AtlasFilters />
            <AtlasExportButton/>
          </SidebarContainer>
        </Sidebar>
      </Holder>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  mapReference: ownProps.mapReference,
  canvasURL: ownProps.canvasURL,
  isSidebarOpened: fromSidebar.isOpened(state),
  isContextualInfoVisible: fromAtlas.isContextualInfoVisible(state),
  isRendering: fromAtlas.isRendering(state),
  showAridity: fromLayers.isLayerVisible(state, fromLayers.aridity(state)),
  showTemperatures: fromLayers.isLayerVisible(state, fromLayers.temperatures(state)),
  showCircles: fromLayers.isLayerVisible(state, fromLayers.circles(state)),
  data: fromFilters.data(state),
  counts: fromFilters.counts(state),
  circleTypes: fromFilters.circlesTypes(state),
  error: state.atlas.error,
});

const mapDispatchToProps = dispatch => ({
  bindMapReference: (ref)=>dispatch(bindMapReference(ref)),
  onZoom: () => dispatch(zoom()),
  onCirclesCreated: (circleSizes) => dispatch(setCircleSizesRefs(circleSizes)),
  onCirclesAdded: (sizes) => dispatch(onAdd(sizes)),
  loadData: () => dispatch(loadData()),
  onRender: () => dispatch(renderSuccess()),
  onMapReady: ()=>dispatch(mapReady()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasContainer);
