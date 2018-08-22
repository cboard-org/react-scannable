import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ScannerContext from './Scanner.context';

import './Scanner.css';

const ITERATION_INTERVAL = 2000;

const dispatchEvent = (element, event) => {
  const { node } = element;
  var eventToDispatch = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false
  });

  node.dispatchEvent(eventToDispatch);
};

const getTreeForElement = (elementNode, scannables) => {
  const children = Array.from(elementNode.children) || [];
  let scannableChildren = [];
  if (children && children.length) {
    const indexes = [];
    scannableChildren = scannables.filter(({ node }, i) => {
      const index = children.indexOf(node);
      if (index >= 0) {
        indexes.push(i);
        return true;
      }
      return false;
    });

    const newScannables = scannables.filter((e, i) => indexes.indexOf(i) < 0);

    scannableChildren.forEach(sc => {
      if (sc.node.children && sc.node.children.length) {
        sc.children = getTreeForElement(sc.node, newScannables);
      }
    });
  }

  const tree = scannableChildren.reduce((prev, sc, i) => {
    const treeId = `${i}_${sc.element.scannableId}`;
    prev[treeId] = { ...sc, treeId };
    return prev;
  }, {});

  return tree;
};

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    // this.scannerOverlay = React.createRef();
    this.elements = {};
    this.tree = {};
    this.selectedElement = null;
    this.state = {
      selectedPath: [],
      elementsToIterate: [],
      focusedIndex: 0
    };

    this.scannerEventAction = this.scannerEventActionFn.bind(this);
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

  scannerEventActionFn(event) {
    const { active } = this.props;

    if (active && !this.selectedElement) {
      event.preventDefault();
      event.stopPropagation();

      const elementToSelect = this.state.elementsToIterate[this.state.focusedIndex];
      if (elementToSelect) {
        this.selectElement(elementToSelect, event);
      }
    }
  }

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
      this.setState({ selectedPath }, this.iterateScannableElements.bind(this));
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
      }, ITERATION_INTERVAL);
    }

    this.setState({ elementsToIterate, focusedIndex: 0 });
  }

  addScannableElement(element) {
    this.elements[element.scannableId] = {
      element,
      node: ReactDOM.findDOMNode(element)
    };
  }

  render() {
    const { children } = this.props;
    const focusedItem =
      this.state.elementsToIterate.length > 0
        ? this.state.elementsToIterate[this.state.focusedIndex].element
        : {};

    const contextValue = {
      ...this.state,
      focusedItem,
      addScannableElement: this.addScannableElement.bind(this)
    };

    return (
      <ScannerContext.Provider value={contextValue}>
        <div className="Scanner__Container">
          {children}
          {/* {!!active && <div className="Scanner__EventsHandler" ref={this.scannerOverlay} />} */}
        </div>
      </ScannerContext.Provider>
    );
  }
}

Scanner.defaultProps = {};
Scanner.propTypes = {
  children: PropTypes.node.isRequired
};

export default Scanner;
