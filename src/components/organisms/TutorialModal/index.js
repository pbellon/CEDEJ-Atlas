import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  MarkdownContent as Content,
  Modal,
  Markdown,
} from 'components';

import { fromTutorial } from 'store/selectors';
import { hideTutorial } from 'store/actions';

const TutorialTitle = () => <span>Comment utiliser la carte</span>;

const TutorialModal = ({ isOpen, inMap, onClose }) => (
  <Modal
    title={<TutorialTitle />}
    isOpen={isOpen && inMap}
    onClose={onClose}
    closeable
  >
    <Markdown source={Content.Tutorial} />
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

export default connect(mapStateToProps, mapDispatchToProps)(TutorialModal);
