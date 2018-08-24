import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ScannerContext from './Scanner.context';
import getTreeForElement from '../../utils/getTreeForElement';
import {
  SCANNER_CLASSNAME,
  SCANNER_CLASSNAME_ACTIVE,
  SCANNER_ITERATION_INTERVAL,
  SCANNABLE_FOCUSED_CLASSNAME,
  SCANNABLE_FOCUSED_VISIBLE_THRESHOLD,
  SCANNER_EVENTS
} from '../../constants';
import dispatchEvent from '../../utils/dispatchEvent';

import './Scanner.css';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.target = document.body;
    this.scannerNode = null;
    this.elements = {};
    this.tree = {};
    this.selectedElement = null;

    this.config = {
      scannerEvents: props.scannerEvents,
      scannerClassName: props.scannerClassName,
      scannerClassNameActive: props.scannerClassNameActive,
      iterationInterval: props.iterationInterval,
      focusedClassName: props.focusedClassName,
      focusedVisibleThreshold: props.focusedVisibleThreshold
    };

    this.state = {
      selectedPath: [],
      elementsToIterate: {},
      keysToIterate: [],
      focusedId: 'not-focused-id'
    };
  }

  componentDidMount() {
    this.registerEvents();

    if (this.props.active) {
      this.findNodes();
      this.iterateScannableElements();
    }
  }

  componentWillUnmount() {
    this.unregisterEvents();
    this.clearIterateInterval();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      if (this.props.active) {
        this.findNodes();
        this.iterateScannableElements();
      } else {
        this.clearIterateInterval();
      }
    }
  }

  registerEvents() {
    this.config.scannerEvents.forEach(e =>
      this.target.addEventListener(e, this.scannerEventAction)
    );
  }

  unregisterEvents() {
    this.config.scannerEvents.forEach(e =>
      this.target.removeEventListener(e, this.scannerEventAction)
    );
  }

  scannerEventAction = event => {
    const { active } = this.props;

    if (active && !this.selectedElement) {
      event.preventDefault();
      event.stopPropagation();

      const elementToSelect = this.state.elementsToIterate[this.state.focusedId];
      if (elementToSelect) {
        this.selectElement(elementToSelect, event);
      }
    }
  };

  clearIterateInterval() {
    if (this.iterateIntervalFn) {
      clearInterval(this.iterateIntervalFn);
    }
  }

  findNodes() {
    this.scannerNode = ReactDOM.findDOMNode(this);
    const elementsArray = Object.values(this.elements);
    const children = getTreeForElement(this.scannerNode, elementsArray);
    this.tree = { children };
  }

  getElementsToIterate() {
    const { active } = this.props;
    let elementsToIterate = {};
    let keysToIterate = [];
    if (!active) {
      return {
        elementsToIterate,
        keysToIterate
      };
    }

    let current = this.tree;
    if (this.state.selectedPath.length) {
      current = this.state.selectedPath.reduce((prev, id) => {
        prev = prev.children[id];
        return prev;
      }, current);
    }

    if (!current || !current.children) {
      current = {};
    }

    elementsToIterate = current.children || {};
    keysToIterate = Object.keys(elementsToIterate).filter(k =>
      elementsToIterate[k].element.isEnabled()
    );

    return {
      elementsToIterate,
      keysToIterate
    };
  }

  selectElement(element, event) {
    if (element && element.treeId) {
      let selectedPath = [];
      if (element.children) {
        selectedPath = this.state.selectedPath.concat(element.treeId);
      } else {
        this.selectedElement = element;
        dispatchEvent(element, event);
      }
      this.setState({ selectedPath }, this.iterateScannableElements);
    }
  }

  getNextScannableId(
    focusedId = this.state.focusedId,
    elementsToIterate = this.state.elementsToIterate,
    keysToIterate = this.state.keysToIterate
  ) {
    const nextFocusedIndex = keysToIterate.indexOf(focusedId) + 1;

    return nextFocusedIndex < keysToIterate.length
      ? keysToIterate[nextFocusedIndex]
      : keysToIterate[0];
  }

  selectNextScannable(keysToIterate = this.state.keysToIterate) {
    const focusedId = this.getNextScannableId();
    this.setState({ focusedId });
  }

  iterateScannableElements(focusedId = this.state.focusedId) {
    this.clearIterateInterval();
    this.selectedElement = null;

    const { elementsToIterate, keysToIterate } = this.getElementsToIterate();
    if (keysToIterate.length) {
      this.iterateIntervalFn = setInterval(() => {
        this.selectNextScannable();
      }, this.config.iterationInterval);
    }

    const newFocusedId = elementsToIterate[focusedId] ? focusedId : keysToIterate[0];

    this.setState({
      elementsToIterate,
      keysToIterate,
      focusedId: newFocusedId
    });
  }

  addScannableElement = element => {
    this.elements[element.scannableId] = {
      element,
      node: ReactDOM.findDOMNode(element)
    };
  };

  updateScannableElement = element => {
    this.elements[element.scannableId] = {
      element,
      node: ReactDOM.findDOMNode(element)
    };

    let focusedId = this.state.focusedId;
    if (element.scannableId === focusedId) {
      focusedId = this.getNextScannableId(focusedId);
    }

    this.findNodes();
    this.iterateScannableElements(focusedId);
  };

  render() {
    const { children, active } = this.props;
    const focusedItem =
      this.state.keysToIterate.length > 0 ? this.state.elementsToIterate[this.state.focusedId] : {};

    const contextValue = {
      ...this.state,
      config: this.config,
      focusedItem,
      addScannableElement: this.addScannableElement,
      updateScannableElement: this.updateScannableElement
    };

    const classes = active ? this.config.scannerClassNameActive : this.config.scannerClassName;

    return (
      <ScannerContext.Provider value={contextValue}>
        <div className={classes}>{children}</div>
      </ScannerContext.Provider>
    );
  }
}

Scanner.defaultProps = {
  active: false,
  scannerEvents: SCANNER_EVENTS,
  scannerClassName: SCANNER_CLASSNAME,
  scannerClassNameActive: SCANNER_CLASSNAME_ACTIVE,
  iterationInterval: SCANNER_ITERATION_INTERVAL,
  focusedClassName: SCANNABLE_FOCUSED_CLASSNAME,
  focusedVisibleThreshold: SCANNABLE_FOCUSED_VISIBLE_THRESHOLD
};

Scanner.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  scannerEvents: PropTypes.arrayOf(PropTypes.string),
  scannerClassName: PropTypes.string,
  scannerClassNameActive: PropTypes.string,
  iterationInterval: PropTypes.number,
  focusedClassName: PropTypes.string,
  focusedVisibleThreshold: PropTypes.number
};

export default Scanner;
