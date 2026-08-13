# react-scannable

[![NPM](https://img.shields.io/npm/v/react-scannable.svg)](https://www.npmjs.com/package/react-scannable)

## Install

```bash
npm install --save react-scannable
```

## Usage

```jsx
import React from 'react';
import { Scannable, Scanner } from 'react-scannable';

function Example() {
  const active = true;

  return (
    <Scanner active={active}>
      <Scannable>
        <button>CLICK</button>
      </Scannable>
    </Scanner>
  );
}
```

## Development

To develop and verify the package locally:

```bash
npm install
npm test
npm run build
npm run demo
```

Run the complete release-oriented verification with `npm run check`.

## License

MIT © [shayc](https://github.com/shayc)
