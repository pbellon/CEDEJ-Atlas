import React, { Component } from 'react';
import  PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import { canvasRendered } from 'store/actions';
import {Atlas, AtlasLegend} from 'components';
import world from 'data/world.json';


const AtlasContainer = ({ canvasURL })=>{
  return (
    <div>
      <AtlasLegend/>
      { canvasURL &&
        <img src={ canvasURL } width="100%" height="auto"/>
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
