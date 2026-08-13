# react-scannable

[![NPM](https://img.shields.io/npm/v/react-scannable.svg)](https://www.npmjs.com/package/react-scannable)

## Install

```bash
npm install --save react-scannable
```

## Usage

```jsx
import React, { Component } from 'react';
import { Scannable, Scanner } from 'react-scannable';

class Example extends Component {
  state = {
    isActive: true,
  };

  render() {
    const active = this.state.isActive;

    return (
      <Scanner active={active}>
        <Scannable>
          <button>CLICK</button>
        </Scannable>
      </Scanner>
    );
  }
}
```

## Development

To develop and verify the package locally:

```bash
npm install
npm test
npm run build
npm run styleguide
```

Run the complete release-oriented verification with `npm run check`.

## License

MIT © [shayc](https://github.com/shayc)
