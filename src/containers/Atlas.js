import React, { Component } from 'react';
import  PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import { canvasRendered } from 'store/actions';
import {Atlas, AtlasLegend} from 'components';
import world from 'data/world.json';


const AtlasContainer = ({ canvasURL })=>{
  console.log('AtlasContainer', canvasURL != null);
  return (
    <div>
      <AtlasLegend/>
      { canvasURL &&
        <img src={ canvasURL }/>
      }
      { (canvasURL == null) &&
        <Atlas width={ 900 } height={ 400 } print={ true }/>
      }
    </div>
  );
}
AtlasContainer.propTypes = {
  canvasURL: PropTypes.string,
}
export default AtlasContainer;
