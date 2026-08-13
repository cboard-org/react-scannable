import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Scannable, Scanner } from '../src';
import './styles.css';

const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

function Demo() {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('Activate the scanner to begin.');

  return (
    <main>
      <header>
        <span className="eyebrow">React component library</span>
        <h1>react-scannable</h1>
        <p>
          Move focus with a click, Space, Tab, or the arrow keys. Select the focused item with Enter
          or a context-menu action.
        </p>
      </header>

      <Scanner
        active={isActive}
        strategy="manual"
        onDeactivation={() => setIsActive(false)}
        onSelect={(_, scannable) => setMessage(`Selected ${scannable.scannableId}`)}
      >
        <section className="panel" aria-label="Scanner demo">
          <Scannable>
            <button
              className="toggle"
              type="button"
              onClick={() => {
                setIsActive((active) => !active);
                setMessage(isActive ? 'Scanner deactivated.' : 'Scanner active.');
              }}
            >
              {isActive ? 'Deactivate scanner' : 'Activate scanner'}
            </button>
          </Scannable>

          <div className="items">
            {items.map((item) => (
              <Scannable key={item} onSelect={() => setMessage(`${item} selected.`)}>
                <button type="button">{item}</button>
              </Scannable>
            ))}
            <Scannable disabled>
              <button type="button" disabled>
                Disabled item
              </button>
            </Scannable>
          </div>

          <output aria-live="polite">{message}</output>
        </section>
      </Scanner>
    </main>
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
