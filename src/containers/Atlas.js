import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Atlas, AtlasLegend} from 'components';
import world from 'data/world.json';


class AtlasContainer extends Component {
  static propTypes = {
    print: PropTypes.bool,
  }

  render(){
    return (
      <div>
        <AtlasLegend/>
        <Atlas data={ world } width={ 900 } height={ 400 }/>
      </div>
    );
  }
}

export default AtlasContainer;
