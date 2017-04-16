import React, { Component } from 'react';
import Modal from './Modal.js';
import css from './App.css';


class App extends Component {
  getInitialState() {
    return {
      showModal: false,
      showLazyModal: false
    };
  }

  showModal() {
    this.setState({showModal: true});
  }

  hideModal() {
    this.setState({showModal: false});
  }

  showLazyModal() {
    this.setState({showLazyModal: true});
  }

  hideLazyModal() {
    this.setState({showLazyModal: false});
  }

  render() {
    const {showModal, showLazyModal} = this.state;

    return (
      <div className={css.app}>
        <h1>react-page-click</h1>

        <button onClick={this.showModal}>
          Open Modal
        </button>
        &nbsp;Closes on mouse down or touch start events

        <br />

        <button onClick={this.showLazyModal}>
          Open Lazy Model
        </button>
        &nbsp;Closes on mouse down or touch end events

        {showModal ? (
          <Modal onClose={this.hideModal}>
            Modal content
          </Modal>
        ) : null}

        {showLazyModal ? (
          <Modal onClose={this.hideLazyModal} notifyOnTouchEnd>
            Lazy Modal content
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default App;
