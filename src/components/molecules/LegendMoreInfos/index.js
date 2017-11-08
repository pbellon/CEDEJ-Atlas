import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Markdown from 'react-markdown';

import { Link, Modal } from 'components';
import { showMoreInfos, hideMoreInfos } from 'store/actions';
import { fromLegend } from 'store/selectors';

import { LegendInfos } from 'content';


const Holder = styled.div`
  margin-top: 1em;
`;

const MoreInfoTitle = () => <span>À propos de la légende</span>;

const LegendMoreInfos = ({ opened, show, hide }) => (
  <Holder>
    <Link onClick={show}>Plus d&#39;infos sur la légende</Link>
    <Modal
      isOpen={opened}
      title={<MoreInfoTitle />}
      onClose={hide}
      closeable
    >
      <Markdown source={LegendInfos.localized()} />
    </Modal>
  </Holder>
);

LegendMoreInfos.propTypes = {
  opened: PropTypes.bool,
  show: PropTypes.func,
  hide: PropTypes.func,
};

const mapStateToProps = state => ({
  opened: fromLegend.moreInfosVisible(state),
});

const mapDispatchToProps = dispatch => ({
  show: () => dispatch(showMoreInfos()),
  hide: () => dispatch(hideMoreInfos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LegendMoreInfos);
