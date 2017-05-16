import React from 'react';
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

const ExportForm = ({ handleSubmit, submitting }) => {
  return (
    <Form>
      <Heading level={2}>Exporter la carte</Heading>
      <Field name="_image" type="hidden" component="input" />
      <Field name="_csrf" type="hidden" component="input" />
      <Button
        type="submit"
        onClick={handleSubmit(values => { submitFormat(values, 'png', this); })}
        disabled={submitting}
      >PNG</Button>
      <Button
        type="submit"
        onClick={handleSubmit(values => { submitFormat(values, 'pdf', this); })}
        disabled={submitting}
      >PDF</Button>
    </Form>
  );
};

ExportForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default ExportForm;
