import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { createRenderMapRequest } from 'store/actions';
import { createValidator, required } from 'services/validation';

import { ExportForm } from 'components';

const ExportFormContainer = (props) => (<ExportForm {...props} />);

const onSubmit = (data, dispatch) => new Promise((resolve, reject) => {
  dispatch(createRenderMapRequest(data, resolve, reject));
});

const validate = createValidator({
  format: [required],
});

export const config = {
  form: 'ExportForm',
  fields: ['format'],
  destroyOnUnmount: true,
  onSubmit,
  validate,
};

export default connect(null)(reduxForm(config)(ExportFormContainer));
