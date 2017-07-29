import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadData } from 'store/actions';
import { fromFilters, fromLayers } from 'store/selectors';
import styled from 'styled-components';

import { Atlas, AtlasLegend } from 'components';

const Error = styled.span`
  color: red;
`;

class AtlasContainer extends Component {
  componentDidMount(){
    this.props.dispatch(loadData());
  }

  render(){
    const { canvasURL, data, error, showAreas, showCircles } = this.props;
    return (
      <div>
      { error &&
        <Error>{error.message}</Error>
      }
      { canvasURL &&
        <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
      }
      { data && (
        <Atlas width={900} height={500} data={data}
          showAreas={ showAreas }
          showCircles={ showCircles }/>
      )}
      </div>
    );
  }
}

AtlasContainer.propTypes = {
  canvasURL: PropTypes.string,
  data: PropTypes.shape({
    aridity:PropTypes.array,
    circles:PropTypes.array,
    temperatures: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  showAreas: fromLayers.isLayerVisible(state, fromLayers.temperatures(state)),
  showCircles: fromLayers.isLayerVisible(state, fromLayers.circles(state)),
  data: fromFilters.data(state),
  error: state.atlas.error,
});

export default connect(mapStateToProps)(AtlasContainer);
