const configKeys = [
  'advanceClickEvent',
  'advanceKeyCodes',
  'autoDeactivateCount',
  'autoDeactivateKeyCodes',
  'className',
  'classNameActive',
  'events',
  'iterationInterval',
  'focusedClassName',
  'focusedVisibleThreshold',
  'selectClickEvent',
  'selectDebounceTime',
  'selectKeyCodes',
  'strategy',
  'target'
];

const getConfig = props => {
  const config = {};
  const propsKeys = Object.keys(props).filter(k => configKeys.indexOf(k) >= 0);

  propsKeys.forEach(k => {
    config[k] = props[k];
  });

  return config;
};

export default getConfig;
