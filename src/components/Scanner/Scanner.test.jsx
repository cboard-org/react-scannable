import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Scannable from '../Scannable/Scannable';
import Scanner from './Scanner';

describe('Scanner', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const NativeMouseEvent = window.MouseEvent;
    vi.stubGlobal(
      'MouseEvent',
      class MouseEventWithoutView extends NativeMouseEvent {
        constructor(type, { view: _view, ...options } = {}) {
          super(type, options);
        }
      },
    );
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 140,
      height: 40,
      left: 0,
      right: 100,
      top: 100,
      width: 100,
      x: 0,
      y: 100,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  const render = (element) => {
    act(() => {
      ReactDOM.render(element, container);
    });
  };

  it('renders children with the inactive class by default', () => {
    render(
      <Scanner>
        <span>Ready</span>
      </Scanner>,
    );

    expect(container.firstChild.className).toBe('Scanner__Container');
    expect(container.textContent).toBe('Ready');
  });

  it('moves between enabled items and selects the focused item', () => {
    vi.useFakeTimers();
    const onButtonClick = vi.fn();
    const onItemSelect = vi.fn();
    const onScannerSelect = vi.fn();

    render(
      <Scanner
        active
        strategy="manual"
        selectDebounceTime={0}
        target={document.body}
        onSelect={onScannerSelect}
      >
        <Scannable>
          <button type="button">First</button>
        </Scannable>
        <Scannable disabled>
          <button type="button">Disabled</button>
        </Scannable>
        <Scannable onSelect={onItemSelect}>
          <button type="button" onClick={onButtonClick}>
            Second
          </button>
        </Scannable>
      </Scanner>,
    );

    const [first, disabled, second] = container.querySelectorAll('button');
    expect(container.firstChild.className).toBe('Scanner__Container Scanner__Container--active');
    expect(first.classList.contains('scanner__focused')).toBe(true);
    expect(disabled.classList.contains('scanner__focused')).toBe(false);

    act(() => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(first.classList.contains('scanner__focused')).toBe(false);
    expect(second.classList.contains('scanner__focused')).toBe(true);

    const selectEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    act(() => {
      document.body.dispatchEvent(selectEvent);
    });

    expect(selectEvent.defaultPrevented).toBe(true);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onItemSelect).toHaveBeenCalledTimes(1);
    expect(onScannerSelect).toHaveBeenCalledTimes(1);
  });
});
