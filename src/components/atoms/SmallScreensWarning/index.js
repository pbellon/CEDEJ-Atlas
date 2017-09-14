import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

import { noop } from 'utils';
import { Modal } from 'components';

const Title = ()=><span>Écran non supporté</span>

class SmallScreensWarning extends Component {
  constructor(props){
    super(props);
    this.state = {
      closed: false
    }
  }

  close(){
    this.setState({ closed: true });
  }

  render(){
    const { closed } = this.state;
    return (
      <MediaQuery query="(max-width: 1200px)">
        <Modal title={<Title/>} isOpen={!closed} closeable={true} onClose={this.close.bind(this)}>
          <p>Cette application est conçue pour les écrans larges et risque de mal fonctionner. </br> Optimisez la taille de la fenêtre de votre navigateur, ou privilégiez une expérience sur ordinateur.</p>
        </Modal>
      </MediaQuery>
    );
  }
}

export default SmallScreensWarning;
