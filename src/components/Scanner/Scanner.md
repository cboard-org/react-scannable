```js
initialState = { isActive: false };
<Scanner active={state.isActive}>
  <Scannable>
    <button type="button" onClick={() => setState({ isActive: !state.isActive })}>
      {state.isActive ? 'Deactivate' : 'Activate'}
    </button>
  </Scannable>
  <div>
    <Scannable>
      <div>
        <span>
          <button type="button">Not scannable</button>
          <span>
            <span>
              <Scannable>
                <button type="button" onClick={() => alert('Button #1.1')}>
                  1.1
                </button>
              </Scannable>
            </span>
          </span>
        </span>
        <Scannable disabled>
          <button type="button" onClick={() => alert('Button #1.2')}>
            1.2 (disabled scannable)
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #1.3')}>
            1.3
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #1.4')}>
            1.4
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #1.5')}>
            1.5
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #1.6')}>
            1.6
          </button>
        </Scannable>
      </div>
    </Scannable>
    <Scannable>
      <div>
        <Scannable>
          <button type="button" onClick={() => alert('Button #2.1')}>
            2.1
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #2.2')}>
            2.2
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #2.3')}>
            2.3
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #2.4')}>
            2.4
          </button>
        </Scannable>
        <Scannable>
          <button type="button" onClick={() => alert('Button #2.5')}>
            2.5
          </button>
        </Scannable>
      </div>
    </Scannable>
    <Scannable>
      <div>
        <Scannable>
          <button type="button" onClick={() => alert('Button #3.1')}>
            3.1
          </button>
        </Scannable>
        <span>
          <span>
            <button type="button">Don't scan me</button>
          </span>
          <span>
            <Scannable>
              <button type="button" onClick={() => alert('Button #3.2')}>
                3.2
              </button>
            </Scannable>
            <button type="button">Nope, I'm not a scannable button</button>
          </span>
        </span>
        <Scannable>
          <button type="button" onClick={() => alert('Button #3.3')}>
            3.3
          </button>
        </Scannable>
      </div>
    </Scannable>
  </div>
</Scanner>;
```
