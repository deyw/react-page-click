import React from 'react';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';


const MAX_MOVE = 20;


const extractCoordinates = ({changedTouches}) =>
  ({x: changedTouches[0].screenX, y: changedTouches[0].screenY});


export const ReactPageClick = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    notify: React.PropTypes.func.isRequired,
    onMouseDown: React.PropTypes.func,
    onTouchStart: React.PropTypes.func,
    outsideOnly: React.PropTypes.bool,
    notifyOnTouchEnd: React.PropTypes.bool
  },


  getDefaultProps() {
    return {
      outsideOnly: true,
      notifyOnTouchEnd: false
    };
  },


  componentWillMount() {
    this.insideClick = false;
    this.touchStart = null;
  },


  componentDidMount() {
    global.window.addEventListener('mousedown', this.onDocumentMouseDown, false);
    global.window.addEventListener('mouseup', this.onDocumentMouseUp, false);
    global.window.addEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.addEventListener('touchend', this.onDocumentTouchEnd, false);
  },


  shouldComponentUpdate,


  componentWillUnmount() {
    global.window.removeEventListener('mousedown', this.onDocumentMouseDown, false);
    global.window.removeEventListener('mouseup', this.onDocumentMouseUp, false);
    global.window.removeEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.removeEventListener('touchend', this.onDocumentTouchEnd, false);
  },


  onDocumentMouseDown(...args) {
    if (this.insideClick || this.props.notifyOnTouchEnd) {
      return;
    }
    this.props.notify(...args);
  },


  onDocumentMouseUp() {
    this.insideClick = false;
  },


  onDocumentTouchStart(event, ...args) {
    if (this.insideClick) {
      return;
    }
    if (this.props.notifyOnTouchEnd) {
      this.touchStart = extractCoordinates(event);
    } else {
      this.props.notify(event, ...args);
    }
  },


  onDocumentTouchEnd(event, ...args) {
    // on mobile safari click events are not bubbled up to the document unless the target has the
    // css `cursor: pointer;` http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html
    // so try and work out if we should call the notify prop
    if (this.props.notifyOnTouchEnd && this.touchStart && !this.insideClick) {
      const {x, y} = extractCoordinates(event);
      const dx = Math.abs(x - this.touchStart.x);
      const dy = Math.abs(y - this.touchStart.y);

      if (dx < MAX_MOVE && dy < MAX_MOVE) {
        this.props.notify(event, ...args);
      }
    }
    this.touchStart = null;
    this.insideClick = false;
  },


  onMouseDown(...args) {
    this.insideClick = true;
    if (this.props.onMouseDown) {
      this.props.onMouseDown(...args);
    }
  },


  onTouchStart(...args) {
    this.insideClick = true;
    if (this.props.onTouchStart) {
      this.props.onTouchStart(...args);
    }
  },


  render() {
    const props = this.props.outsideOnly ? {
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onTouchStart
    } : {};

    return React.cloneElement(React.Children.only(this.props.children), props);
  }
});
