import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { Button, Heading } from 'components';

const Form = styled.form`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
`;

const submitFormat = (values, format, ctx) => {
  ctx.props.onSubmit({ ...values, format }, ctx.props.dispatch);
};

export default class ExportForm extends Component {
  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Form>
        <Heading level={2}>Exporter la carte</Heading>
        <Field name="_image" type="hidden" component="input" />
        <Field name="_csrf" type="hidden" component="input" />
        <Button
          type="submit"
          onClick={handleSubmit(vals => { submitFormat(vals, 'png', this) })}
          disabled={submitting}
        >PNG</Button>
        <Button
          type="submit"
          onClick={handleSubmit(vals => { submitFormat(vals, 'pdf', this) })}
          disabled={submitting}
        >PDF</Button>
      </Form>
    );
  }
}
