import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'react-materialize';


const Checkbox = ({onToggle, toggled, label})=>(
  <Input type="checkbox" checked={toggled} onChange={ onToggle && onToggle() } label={ label }/>
);

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onToggle: PropTypes.func
}

export default Checkbox;
