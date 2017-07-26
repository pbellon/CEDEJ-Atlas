import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { downloadMapData } from 'store/actions';
import styled from 'styled-components';

import { Atlas, AtlasLegend } from 'components';

const Error = styled.span`
  color: red;
`;

class AtlasContainer extends Component {
  componentDidMount(){
    this.props.dispatch(downloadMapData());
  }

  render(){
    const { canvasURL, data, error } = this.props;
    return (
        <div>
        { error &&
          <Error>{error.message}</Error>
        }
        { canvasURL &&
          <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
        }
        { (canvasURL == null) && data &&
          <div>
          {
            // <CanvasTest width={1280*4} height={900*3} scale={1800} center={[-100,50]} data={data} />
          }
          <Atlas width={900} height={500} data={data} />
            </div>
        }
        </div>
        );
  }
}

AtlasContainer.propTypes = {
  canvasURL: PropTypes.string,
  data: PropTypes.shape({
    aridity:PropTypes.object,
    circles:PropTypes.object,
    temperatures: PropTypes.object,
  }),
};

const mapStateToProps = state => ({
  data: state.atlas.mapData,
  error: state.atlas.error,
});

export default connect(mapStateToProps)(AtlasContainer);
