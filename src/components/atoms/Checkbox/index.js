import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css }  from 'styled-components'; 
import { font } from 'styled-theme'; 

import { Label } from 'components';

const Check = styled.input.attrs({
  type: 'checkbox',
})`
`;

const Wrapper = styled.span`
  font-family: ${font('primary')};
  font-size: 0.7rem;
  & * {
    cursor: ${({ disabled })=>disabled?'not-allowed':'pointer'};
  }
`;

class Checkbox extends Component {
  onChange(event){
    
    setTimeout(()=>{
      this.props.onChange && this.props.onChange();
    }, 10);

  }
  bindLabel(label){
    if(!this.label){
      this.label = label;
      this.label.onclick = ()=>{
        if(!this.props.disabled){
          this.input.value = this.input.value === 'on' ? 'off' : 'on'; 
          this.input.checked = !this.input.checked;
          this.onChange();
        }
      };
    }
  }
  bindInput(input){
    if(this.props && !this.input){
      console.log('bindInput');
      this.input = input;
      this.input.checked = this.props.checked;
      this.input.value = this.props.checked ? 'on' : 'off';
      this.input.onclick = (e)=>{
        // this.input.checked = !this.input.checked;
        this.onChange();
      };
    }
  }

  render(){
    return (
      <Wrapper disabled={ this.props.disabled }>
        <input type='checkbox'
          ref={ (ref)=>this.bindInput(ref) }
          disabled={ this.props.disabled }/>
        <label ref={ (ref)=>this.bindLabel(ref) }>
          { this.props.label }
        </label>
      </Wrapper>
      
    );
  }
}
export default Checkbox;
