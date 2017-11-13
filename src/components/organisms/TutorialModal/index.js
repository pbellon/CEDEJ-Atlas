import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Modal,
  Markdown,
} from 'components';

import { fromTutorial } from 'store/selectors';
import { hideTutorial } from 'store/actions';

import { Tutorial } from 'content';

const TutorialModal = ({ isOpen, inMap, onClose, t}) => (
  <Modal
    title={t('tutorial.title')}
    isOpen={isOpen && inMap}
    onClose={onClose}
    closeable
  >
    <Markdown source={Tutorial.localized()} />
  </Modal>
);

TutorialModal.propTypes = {
  isOpen: PropTypes.bool,
  inMap: PropTypes.bool,
  onClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  inMap: ownProps.inMap,
  isOpen: fromTutorial.isVisible(state),
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(hideTutorial()),
});

const I18nTutorialModal = translate('modals')(TutorialModal)

export default connect(mapStateToProps, mapDispatchToProps)(I18nTutorialModal);
