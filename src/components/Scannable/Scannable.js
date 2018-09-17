import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import ScannerContext from '../Scanner/Scanner.context';
import checkVisibleAndScroll from '../../utils/checkVisibleAndScroll';

class Scannable extends React.Component {
  constructor(props) {
    super(props);

    this.scannableId = uuidv4();
    this.isFocused = false;
  }

  isEnabled() {
    return !this.props.disabled;
  }

  onSelect(event) {
    this.props.onSelect(event, this, this.props.scanner);
  }

  componentDidMount() {
    const { scanner } = this.props;
    if (scanner && scanner.addScannableElement) {
      scanner.addScannableElement(this);
    }
  }

  componentDidUpdate({ disabled }) {
    if (disabled !== this.props.disabled) {
      const { scanner } = this.props;
      scanner.updateScannableElement(this);
    }
  }

  render() {
    const { children, scanner, disabled, onFocus, onBlur, ...other } = this.props;
    const { focusedItem, config } = scanner;

    let childrenWithProps = children;

    if (config) {
      const { focusedClassName, focusedVisibleThreshold } = config;
      childrenWithProps = React.Children.map(children, child => {
        const classes = [child.props.className || ''];
        const isFocused =
          focusedItem.element && focusedItem.element.scannableId === this.scannableId;
        const isBlurred = this.isFocused && !isFocused;
        this.isFocused = isFocused;

        if (isFocused) {
          classes.push(focusedClassName);
          checkVisibleAndScroll(focusedItem.node, focusedVisibleThreshold);
          onFocus(this, scanner);
        } else if (isBlurred) {
          onBlur(this, scanner);
        }

        const className = classes.join(' ').trim();
        return React.cloneElement(child, { className, ...other });
      });
    }

    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

Scannable.defaultProps = {
  disabled: false,
  onFocus: () => {},
  onBlur: () => {},
  onSelect: () => {}
};

Scannable.propTypes = {
  children: PropTypes.node.isRequired,
  scanner: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSelect: PropTypes.func
};

const WithScanner = Component => {
  return props => (
    <ScannerContext.Consumer>
      {scannerContext => <Component {...props} scanner={scannerContext} />}
    </ScannerContext.Consumer>
  );
};

export default WithScanner(Scannable);
