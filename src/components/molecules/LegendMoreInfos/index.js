import React from 'react';
import { translate } from 'react-i18next';
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

const LegendMoreInfos = ({ t, opened, show, hide }) => (
  <Holder>
    <Link onClick={show}>{ t('legend.moreInfos.link') }</Link>
    <Modal
      isOpen={opened}
      title={t('legend.moreInfos.title')}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  translate('atlas')(LegendMoreInfos)
);
