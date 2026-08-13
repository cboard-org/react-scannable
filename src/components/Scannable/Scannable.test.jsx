import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Scanner from '../Scanner/Scanner';
import Scannable from './Scannable';

describe('Scannable', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it('preserves child classes and forwards DOM props', () => {
    act(() => {
      ReactDOM.render(
        <Scanner>
          <Scannable aria-label="scannable item" data-kind="example">
            <button className="original" type="button">
              Item
            </button>
          </Scannable>
        </Scanner>,
        container,
      );
    });

    const button = container.querySelector('button');
    expect(button.className).toBe('original');
    expect(button.getAttribute('aria-label')).toBe('scannable item');
    expect(button.dataset.kind).toBe('example');
  });
});
