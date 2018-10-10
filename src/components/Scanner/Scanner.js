import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ScannerContext from './Scanner.context';
import {
  SCANNER_CLASSNAME,
  SCANNER_CLASSNAME_ACTIVE,
  SCANNER_ITERATION_INTERVAL,
  SCANNABLE_FOCUSED_CLASSNAME,
  SCANNABLE_FOCUSED_VISIBLE_THRESHOLD,
  SCANNER_EVENTS,
  SCANNER_STRATEGY,
  SCANNER_SELECT_KEYCODES,
  SCANNER_ADVANCE_KEYCODES,
  SCANNER_SELECT_CLICKEVENT,
  SCANNER_ADVANCE_CLICKEVENT,
  SCANNER_SELECT_DEBOUNCE_TIME,
  SCANNER_AUTODEACTIVATE_KEYCODES,
  SCANNER_AUTODEACTIVATE_COUNT,
  SCANNER_MOVE_BACK_KEYS
} from '../../constants';
import utils from '../../utils';

import './Scanner.css';

const { getConfig, getStrategy, getTreeForElement, debounce } = utils;

const SCANNER_INITIAL_STATE = {
  selectedPath: [],
  elementsToIterate: {},
  keysToIterate: [],
  focusedId: 'not-valid-id'
};

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = SCANNER_INITIAL_STATE;
    this.scannerNode = null;
    this.elements = {};
    this.tree = {};
    this.selectedElement = null;
    this.config = getConfig(props);
    this.strategy = getStrategy(this.config.strategy, this);
    this.debouncedSelectElement = debounce((element, event) => {
      this.selectElement(element, event);
    }, this.config.selectDebounceTime);

    this.target = this.config.target;
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
    this.strategy.deactivate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      if (this.props.active) {
        this.findNodes();
        this.iterateScannableElements();
      } else {
        this.strategy.deactivate();
        this.setState(SCANNER_INITIAL_STATE);
      }
    }

    const newConfig = getConfig(this.props);
    if (newConfig.strategy !== this.config.strategy) {
      this.strategy.deactivate();
      this.strategy = getStrategy(newConfig.strategy, this);
    }

    this.config = newConfig;
    this.debouncedSelectElement = debounce((element, event) => {
      this.selectElement(element, event);
    }, this.config.selectDebounceTime);
  }

  triggerDeactivation() {
    this.props.onDeactivation();
    this.setState(SCANNER_INITIAL_STATE);
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

  selectElement(scannable, event) {
    if (scannable && scannable.treeId) {
      this.strategy.selectElement(scannable, event);
    }
  }

  setSelectedElement(scannable, event) {
    this.selectedElement = scannable;

    this.props.onSelect(event, scannable, this);
  }

  setSelectedPath(selectedPath = this.state.selectedPath) {
    this.setState({ selectedPath }, this.iterateScannableElements);
  }

  focusScannable(focusedId) {
    this.setState({ focusedId }, this.onScannableFocus);
  }

  iterateScannableElements(focusedId = this.state.focusedId) {
    this.selectedElement = null;

    const { elementsToIterate, keysToIterate } = this.getElementsToIterate();

    const newFocusedId = elementsToIterate[focusedId] ? focusedId : keysToIterate[0];

    this.setState(
      {
        elementsToIterate,
        keysToIterate,
        focusedId: newFocusedId
      },
      () => {
        this.onScannableFocus(newFocusedId);
        this.strategy.activate();
      }
    );
  }

  registerEvents() {
    this.config.events.forEach(e => this.target.addEventListener(e, this.scannerEventAction));
  }

  unregisterEvents() {
    this.config.events.forEach(e => this.target.removeEventListener(e, this.scannerEventAction));
  }

  scannerEventAction = event => {
    const { active } = this.props;

    let shouldContinue = true;
    if (this.config.autoDeactivateCount) {
      shouldContinue = this.strategy.checkAutoDeactivation(event);
    }

    if (!shouldContinue) {
      this.props.onAutoDeactivateAction(event);
    }

    if (active && shouldContinue && !this.selectedElement) {
      event.preventDefault();
      event.stopPropagation();

      const elementToSelect = this.state.elementsToIterate[this.state.focusedId];
      if (elementToSelect) {
        this.debouncedSelectElement(elementToSelect, event);
      }
    }
  };

  addScannableElement = element => {
    this.elements[element.scannableId] = {
      element,
      node: ReactDOM.findDOMNode(element)
    };

    if (this.props.active) {
      this.findNodes();
    }
  };

  updateScannableElement = element => {
    this.elements[element.scannableId] = {
      element,
      node: ReactDOM.findDOMNode(element)
    };

    let focusedId = this.state.focusedId;
    if (element.scannableId === focusedId) {
      focusedId = this.strategy.getNextScannableId(focusedId);
    }

    this.findNodes();
    this.iterateScannableElements(focusedId);
  };

  onScannableFocus = (focusedId = this.state.focusedId) => {
    const { element } = this.state.elementsToIterate[focusedId] || {};
    if (element) {
      this.props.onFocus(element, this);
    }
  };

  reset = () => {
    this.strategy.deactivate();
    this.findNodes();
    this.setState(SCANNER_INITIAL_STATE, this.iterateScannableElements);
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
      updateScannableElement: this.updateScannableElement,
      reset: this.reset
    };

    const classes = active ? this.config.classNameActive : this.config.className;

    return (
      <ScannerContext.Provider value={contextValue}>
        <div className={classes}>{children}</div>
      </ScannerContext.Provider>
    );
  }
}

Scanner.defaultProps = {
  active: false,
  autoDeactivateCount: SCANNER_AUTODEACTIVATE_COUNT,
  autoDeactivateKeyCodes: SCANNER_AUTODEACTIVATE_KEYCODES,
  advanceKeyCodes: SCANNER_ADVANCE_KEYCODES,
  advanceClickEvent: SCANNER_ADVANCE_CLICKEVENT,
  moveBackKeyCodes: SCANNER_MOVE_BACK_KEYS,
  className: SCANNER_CLASSNAME,
  classNameActive: SCANNER_CLASSNAME_ACTIVE,
  events: SCANNER_EVENTS,
  focusedClassName: SCANNABLE_FOCUSED_CLASSNAME,
  focusedVisibleThreshold: SCANNABLE_FOCUSED_VISIBLE_THRESHOLD,
  iterationInterval: SCANNER_ITERATION_INTERVAL,
  onSelect: () => {},
  onFocus: () => {},
  onAutoDeactivateAction: () => {},
  onDeactivation: () => {},
  selectClickEvent: SCANNER_SELECT_CLICKEVENT,
  selectDebounceTime: SCANNER_SELECT_DEBOUNCE_TIME,
  selectKeyCodes: SCANNER_SELECT_KEYCODES,
  strategy: SCANNER_STRATEGY,
  target: document.body
};

Scanner.propTypes = {
  active: PropTypes.bool,
  autoDeactivateCount: PropTypes.number,
  autoDeactivateKeyCodes: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  advanceKeyCodes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  advanceClickEvent: PropTypes.string,
  moveBackKeyCodes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  classNameActive: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.string),
  focusedClassName: PropTypes.string,
  focusedVisibleThreshold: PropTypes.number,
  iterationInterval: PropTypes.number,
  onSelect: PropTypes.func,
  onFocus: PropTypes.func,
  onAutoDeactivateAction: PropTypes.func,
  onDeactivation: PropTypes.func,
  selectClickEvent: PropTypes.string,
  selectDebounceTime: PropTypes.number,
  selectKeyCodes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  strategy: PropTypes.string,
  target: PropTypes.instanceOf(Element)
};

export default Scanner;
