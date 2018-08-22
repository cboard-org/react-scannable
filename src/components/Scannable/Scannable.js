import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import ScannerContext from '../Scanner/Scanner.context';

const SCANNABLE_FOCUSED_CLASSNAME = 'scanner__focused';

class Scannable extends React.Component {
  constructor(props) {
    super(props);
    this.scannableRef = React.createRef();
    this.scannableId = uuidv4();
  }

  componentDidMount() {
    const { scanner } = this.props;
    if (scanner && scanner.addScannableElement) {
      scanner.addScannableElement(this, this.scannableRef);
    }
  }

  render() {
    const {
      children,
      scanner: { focusedItem }
    } = this.props;

    const childrenWithProps = React.Children.map(children, child => {
      const isFocused = focusedItem && focusedItem.scannableId === this.scannableId;
      const classes = [child.props.className || '', isFocused ? SCANNABLE_FOCUSED_CLASSNAME : ''];
      const className = classes.join(' ').trim();
      return React.cloneElement(child, { className, ref: this.scannableRef });
    });

    return <React.Fragment>{childrenWithProps}</React.Fragment>;
  }
}

Scannable.defaultProps = {
  scanner: {}
};

Scannable.propTypes = {
  children: PropTypes.node.isRequired,
  scanner: PropTypes.object
};

const WithScanner = Component => {
  return props => (
    <ScannerContext.Consumer>
      {scannerContext => <Component {...props} scanner={scannerContext} />}
    </ScannerContext.Consumer>
  );
};

export default WithScanner(Scannable);
