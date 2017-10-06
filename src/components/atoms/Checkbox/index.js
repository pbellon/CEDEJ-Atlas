import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { font } from 'styled-theme';

const Wrapper = styled.span`
  font-family: ${font('primary')};
  font-size: 0.7rem;
  & * {
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  }
`;

class Checkbox extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBeforeChange: PropTypes.func,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
  }

  onChange() {
    this.props.onBeforeChange && this.props.onBeforeChange();
    if (!this.onChangeTimeoutID) {
      this.onChangeTimeoutID = setTimeout(() => {
        this.props.onChange();
        this.onChangeTimeoutID = null;
      }, 100);
    }
  }

  bindLabel(label) {
    if (!this.label) {
      this.label = label;
      this.label.onclick = () => {
        if (!this.props.disabled) {
          this.input.value = this.input.value === 'on' ? 'off' : 'on';
          this.input.checked = !this.input.checked;
          this.onChange();
        }
      };
    }
  }

  bindInput(input) {
    if (this.props && !this.input) {
      this.input = input;
      this.input.checked = this.props.checked;
      this.input.value = this.props.checked ? 'on' : 'off';
      this.input.onclick = () => {
        // this.input.checked = !this.input.checked;
        this.onChange();
      };
    }
  }

  render() {
    return (
      <Wrapper disabled={this.props.disabled}>
        <input
          id={this.props.id}
          type="checkbox"
          ref={(ref) => this.bindInput(ref)}
          disabled={this.props.disabled}
        />
        <label htmlFor={this.props.id}>
          { this.props.label }
        </label>
      </Wrapper>
    );
  }
}

export default Checkbox;
