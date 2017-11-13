import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { translate } from 'react-i18next';

import { Modal } from 'components';

class SmallScreensWarning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: false,
    };
  }

  close() {
    this.setState({ closed: true });
  }

  render() {
    const { closed } = this.state;
    const { t } = this.props;
    return (
      <MediaQuery query="(max-width: 1200px)">
        <Modal
          title={t('smallScreenWarning.title')}
          isOpen={!closed}
          closeable
          onClose={() => this.close()}
        >
          <p
              dangerouslySetInnerHTML={{__html: t('smallScreenWarning.description')}}
          />
        </Modal>
      </MediaQuery>
    );
  }
}

export default translate('modals')(SmallScreensWarning);
