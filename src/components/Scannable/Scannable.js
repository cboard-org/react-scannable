import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import ScannerContext from '../Scanner/Scanner.context';
import checkVisibleAndScroll from '../../utils/checkVisibleAndScroll';

class Scannable extends React.Component {
  constructor(props) {
    super(props);

    this.scannableId = uuidv4();
  }

  isEnabled() {
    return !this.props.disabled;
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
    const {
      children,
      scanner: {
        focusedItem,
        config: { focusedClassName, focusedVisibleThreshold }
      },
      disabled,
      ...other
    } = this.props;

    const childrenWithProps = React.Children.map(children, child => {
      const classes = [child.props.className || ''];
      const isFocused = focusedItem.element && focusedItem.element.scannableId === this.scannableId;

      if (isFocused) {
        classes.push(focusedClassName);
        checkVisibleAndScroll(focusedItem.node, focusedVisibleThreshold);
      }
      const className = classes.join(' ').trim();
      return React.cloneElement(child, { className, ...other });
    });

    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

Scannable.defaultProps = {
  disabled: false
};

Scannable.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  scanner: PropTypes.object.isRequired
};

const WithScanner = Component => {
  return props => (
    <ScannerContext.Consumer>
      {scannerContext => <Component {...props} scanner={scannerContext} />}
    </ScannerContext.Consumer>
  );
};

export default WithScanner(Scannable);
