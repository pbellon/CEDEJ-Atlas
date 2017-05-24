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
        <AtlasLegend />
        { canvasURL &&
          <img src={canvasURL} alt={'Render map'} width="100%" height="auto" />
        }
        { (canvasURL == null) && data &&
          <Atlas width={900} height={500} data={data} />
        }
      </div>
    );
  }
}

AtlasContainer.propTypes = {
  canvasURL: PropTypes.string,
  data: PropTypes.object,
};

const mapStateToProps = state => ({
  data: state.atlas.mapData,
  error: state.atlas.error,
});

export default connect(mapStateToProps)(AtlasContainer);
