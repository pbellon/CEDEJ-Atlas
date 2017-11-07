import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { translate } from 'react-i18next';

import { Modal } from 'components';

const Title = () => <span>Écran non supporté</span>;

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
          title={<span>{ t('title') }</span>}
          isOpen={!closed}
          closeable
          onClose={() => this.close()}
        >
          <p>Cette application est conçue pour les écrans larges et risque de mal fonctionner. <br /> Optimisez la taille de la fenêtre de votre navigateur, ou privilégiez une expérience sur ordinateur.</p>
        </Modal>
      </MediaQuery>
    );
  }
}

export default translate('smallScreenWarning')(SmallScreensWarning);
