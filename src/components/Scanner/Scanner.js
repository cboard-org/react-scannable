import React from 'react';
import PropTypes from 'prop-types';
import ScannerContext from './Scanner.context';
import getTreeForElement from '../../utils/getTreeForElement';
import {
  SCANNER_ITERATION_INTERVAL,
  SCANNABLE_FOCUSED_CLASSNAME,
  SCANNABLE_FOCUSED_VISIBLE_THRESHOLD
} from '../../constants';

import './Scanner.css';
import dispatchEvent from '../../utils/dispatchEvent';

class Scanner extends React.Component {
  constructor(props) {
    super(props);

    this.scannerNode = React.createRef();
    this.elements = {};
    this.tree = {};
    this.selectedElement = null;

    this.config = {
      iterationInterval: props.iterationInterval,
      focusedClassName: props.focusedClassName,
      focusedVisibleThreshold: props.focusedVisibleThreshold
    };

    this.state = {
      selectedPath: [],
      elementsToIterate: [],
      focusedIndex: 0
    };
  }

  componentDidMount() {
    this.findNodes();
    this.registerEvents();

    if (this.props.active) {
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
        this.iterateScannableElements();
      } else {
        this.clearIterateInterval();
      }
    }
  }

  registerEvents() {
    document.body.addEventListener('click', this.scannerEventAction);
    document.body.addEventListener('contextmenu', this.scannerEventAction);
    document.body.addEventListener('keydown', this.scannerEventAction);
  }

  unregisterEvents() {
    document.body.removeEventListener('click', this.scannerEventAction);
    document.body.removeEventListener('contextmenu', this.scannerEventAction);
    document.body.removeEventListener('keydown', this.scannerEventAction);
  }

  scannerEventAction = event => {
    const { active } = this.props;

    if (active && !this.selectedElement) {
      event.preventDefault();
      event.stopPropagation();

      const elementToSelect = this.state.elementsToIterate[this.state.focusedIndex];
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
    const elementsArray = Object.values(this.elements);
    const children = getTreeForElement(this.scannerNode.current, elementsArray);
    this.tree = { children };
  }

  getElementsToIterate() {
    const { active } = this.props;
    if (!active) {
      return [];
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

    const elementsToIterate = current.children ? Object.values(current.children) : [];

    return elementsToIterate;
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

  iterateScannableElements() {
    this.clearIterateInterval();
    this.selectedElement = null;

    const elementsToIterate = this.getElementsToIterate();
    if (elementsToIterate.length) {
      this.iterateIntervalFn = setInterval(() => {
        const nextFocusedIndex = this.state.focusedIndex + 1;
        const focusedIndex = nextFocusedIndex < elementsToIterate.length ? nextFocusedIndex : 0;
        this.setState({ focusedIndex });
      }, SCANNER_ITERATION_INTERVAL);
    }

    this.setState({ elementsToIterate, focusedIndex: 0 });
  }

  addScannableElement = (element, ref) => {
    this.elements[element.scannableId] = {
      element,
      node: ref.current
    };
  };

  render() {
    const { children } = this.props;

    const focusedItem =
      this.state.elementsToIterate.length > 0
        ? this.state.elementsToIterate[this.state.focusedIndex].element
        : {};

    const contextValue = {
      ...this.state,
      config: this.config,
      focusedItem,
      addScannableElement: this.addScannableElement
    };

    return (
      <ScannerContext.Provider value={contextValue}>
        <div className="Scanner__Container" ref={this.scannerNode}>
          {children}
          {/* {!!active && <div className="Scanner__EventsHandler" ref={this.scannerOverlay} />} */}
        </div>
      </ScannerContext.Provider>
    );
  }
}

Scanner.defaultProps = {
  active: false,
  iterationInterval: SCANNER_ITERATION_INTERVAL,
  focusedClassName: SCANNABLE_FOCUSED_CLASSNAME,
  focusedVisibleThreshold: SCANNABLE_FOCUSED_VISIBLE_THRESHOLD
};

Scanner.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  iterationInterval: PropTypes.number,
  focusedClassName: PropTypes.string,
  focusedVisibleThreshold: PropTypes.number
};

export default Scanner;
