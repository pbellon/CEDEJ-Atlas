import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromStatus } from 'store/selectors';

const GenericContainer = ({ loading }) => <div className={loading ? 'loading' : ''} />;

GenericContainer.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: fromStatus.isLoading(state),
});

export default connect(mapStateToProps)(GenericContainer);
