export const SCANNER_STRATEGY = 'automatic';
export const SCANNER_EVENTS = ['click', 'keydown', 'contextmenu'];
export const SCANNER_CLASSNAME = 'Scanner__Container';
export const SCANNER_SELECT_DEBOUNCE_TIME = 400;
export const SCANNER_SELECT_KEYCODES = ['enter', 'backspace', 13, 8];
export const SCANNER_AUTODEACTIVATE_KEYCODES = ['scape', 27];
export const SCANNER_AUTODEACTIVATE_COUNT = 4;
export const SCANNER_ADVANCE_KEYCODES = ['*', 'spacebar', 'tab', 'rightArrow', 'downArrow', 32, 9];
export const SCANNER_SELECT_CLICKEVENT = 'contextmenu';
export const SCANNER_ADVANCE_CLICKEVENT = 'click';
export const SCANNER_MOVE_BACK_KEYS = ['leftArrow', 'upArrow'];
export const SCANNER_CLASSNAME_ACTIVE = 'Scanner__Container Scanner__Container--active';
export const SCANNER_ITERATION_INTERVAL = 2000;
export const SCANNABLE_FOCUSED_CLASSNAME = 'scanner__focused';
export const SCANNABLE_FOCUSED_VISIBLE_THRESHOLD = 5;

export const KEY_CODE_MAP = {
  enter: 13,
  backspace: 8,
  spacebar: 32,
  tab: 9,
  shift: 16,
  control: 17,
  alt: 18,
  leftArrow: 37,
  upArrow: 38,
  rightArrow: 39,
  downArrow: 40,
  escape: 27
};
