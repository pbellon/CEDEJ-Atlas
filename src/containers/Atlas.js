import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import {
  loadData,
  renderSuccess,
  showContextualInfo,
  hideContextualInfo,
  bindMapReference,
  setCircleSizesRefs,
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
  AtlasLegend,
  LoadingIndicator,
  Sidebar,
  TutorialModal,
  AtlasFilters,
  SidebarToggleButton,
  AtlasExportButton,
} from 'components';

import { Sidebar as SidebarContainer } from 'containers';

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
    data: PropTypes.shape({
      aridity: PropTypes.object,
      circles: PropTypes.object,
      temperatures: PropTypes.object,
    }),
    canvasURL: PropTypes.string,
    circleTypes: PropTypes.object,
    error: PropTypes.object,
    isContextualInfoVisible: PropTypes.bool,
    isRendering: PropTypes.bool,
    isSidebarOpened: PropTypes.bool,
    showAreas: PropTypes.bool,
    showCircles: PropTypes.bool,
    onZoom: PropTypes.func,
    onCirclesCreated: PropTypes.func,
    onRender: PropTypes.func,
    loadData: PropTypes.func.isRequired,
    bindMapReference: PropTypes.func.isRequired,
    showContextualInfo: PropTypes.func.isRequired,
    hideContextualInfo: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    const {
      canvasURL,
      circleTypes,
      bindMapReference,
      data,
      error,
      showContextualInfo,
      hideContextualInfo,
      showAreas,
      showCircles,
      isRendering,
      isSidebarOpened,
      onZoom,
      onCirclesCreated,
      onRender,
      onMapPage,
    } = this.props;
    return (
      <Holder className='atlas-holder'>
        <LoadingIndicator isLoading={isRendering} />
        { error &&
          <Error>{ error.message }</Error>
        }
        { canvasURL &&
          <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
        }
        { data && (
          <Atlas
            bindMapReference={bindMapReference}
            data={data}
            circleTypes={circleTypes}
            isSidebarOpened={isSidebarOpened}
            showContextualInfo={showContextualInfo}
            hideContextualInfo={hideContextualInfo}
            onZoomEnd={onZoom}
            onRender={onRender}
            onCirclesCreated={onCirclesCreated}
            showAreas={showAreas}
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
  isSidebarOpened: fromSidebar.isOpened(state),
  isContextualInfoVisible: fromAtlas.isContextualInfoVisible(state),
  isRendering: fromAtlas.isRendering(state),
  showAreas: fromLayers.isLayerVisible(state, fromLayers.temperatures(state)),
  showCircles: fromLayers.isLayerVisible(state, fromLayers.circles(state)),
  data: fromFilters.data(state),
  circleTypes: fromFilters.circlesTypes(state),
  error: state.atlas.error,
});

const mapDispatchToProps = dispatch => ({
  bindMapReference: (ref)=>dispatch(bindMapReference(ref)),
  onZoom: () => dispatch(zoom()),
  onCirclesCreated: (circleSizes) => dispatch(setCircleSizesRefs(circleSizes)),
  showContextualInfo: (data) => dispatch(showContextualInfo(data)),
  hideContextualInfo: () => dispatch(hideContextualInfo()),
  loadData: () => dispatch(loadData()),
  onRender: () => dispatch(renderSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtlasContainer);
