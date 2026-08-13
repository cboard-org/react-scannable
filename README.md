# react-scannable

>

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

## License

MIT © [shayc](https://github.com/shayc)

## Development

This project uses Vite 8 (powered by Rolldown) for the library and demo builds, and Vitest for
tests. The published CommonJS and ESM filenames, automatic CSS injection, and legacy JavaScript
syntax compatibility are retained for existing consumers.

```bash
npm install
npm test
npm run build
npm run styleguide
```

Run the complete release-oriented verification with `npm run check`.
