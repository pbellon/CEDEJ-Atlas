import React from 'react';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import { Route } from 'react-router-dom';

import {
  MarkdownContent as Content,
  Modal,
} from 'components';

import { fromAtlas } from 'store/selectors';
import { hideTutorial } from 'store/actions';

const TutorialTitle = ()=> <span>Comment utiliser la carte</span>

const TutorialModal = ({isOpen, inMap, onClose})=>(
  <Modal
    title={<TutorialTitle/>}
    isOpen={isOpen && inMap}
    onClose={onClose}
    closeable={true}>
    <Markdown source={Content.Tutorial}/>
  </Modal>
);

const mapStateToProps = state => ({
  isOpen: fromAtlas.isTutorialVisible(state),
});
const mapDispatchToProps = dispatch => ({
  onClose: ()=>dispatch(hideTutorial()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TutorialModal);
